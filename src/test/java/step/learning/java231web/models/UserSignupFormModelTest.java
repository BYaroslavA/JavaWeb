package step.learning.java231web.models;

import org.junit.jupiter.api.Test;
import step.learning.java231web.dao.UserDao;
import step.learning.java231web.services.db.IDbService;

import java.lang.reflect.Proxy;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class UserSignupFormModelTest {

    @Test
    public void testValidModelPassesValidation() {
        UserSignupFormModel model = new UserSignupFormModel(
                "Максим Шевченко",
                "maksym.sh@example.com",
                "maksym_dev",
                "SecurePass123",
                "SecurePass123",
                true
        );

        assertTrue(model.isValid());
        assertTrue(model.getValidationErrors().isEmpty());
        assertDoesNotThrow(model::validate);
    }

    @Test
    public void testNullNameThrowsException() {
        UserSignupFormModel model = new UserSignupFormModel(null, "maksym@example.com");

        assertFalse(model.isValid());
        Map<String, String> errors = model.getValidationErrors();
        assertTrue(errors.containsKey("name"));
        assertThrows(IllegalArgumentException.class, model::validate);
    }

    @Test
    public void testEmptyAndBlankNameFails() {
        UserSignupFormModel model1 = new UserSignupFormModel("", "maksym@example.com");
        UserSignupFormModel model2 = new UserSignupFormModel("   ", "maksym@example.com");

        assertFalse(model1.isValid());
        assertFalse(model2.isValid());
        assertTrue(model1.getValidationErrors().containsKey("name"));
        assertTrue(model2.getValidationErrors().containsKey("name"));
    }

    @Test
    public void testShortNameFails() {
        UserSignupFormModel model = new UserSignupFormModel("M", "maksym@example.com");

        assertFalse(model.isValid());
        assertTrue(model.getValidationErrors().containsKey("name"));
        assertThrows(IllegalArgumentException.class, model::validate);
    }

    @Test
    public void testNullEmailFails() {
        UserSignupFormModel model = new UserSignupFormModel("Дмитро", null);

        assertFalse(model.isValid());
        assertTrue(model.getValidationErrors().containsKey("email"));
        assertThrows(IllegalArgumentException.class, model::validate);
    }

    @Test
    public void testInvalidEmailFormatFails() {
        String[] invalidEmails = {"notanemail", "client@", "@domain.org", "test@domain", "test@.net"};

        for (String invalidEmail : invalidEmails) {
            UserSignupFormModel model = new UserSignupFormModel("Дмитро", invalidEmail);
            assertFalse(model.isValid(), "Email should be invalid: " + invalidEmail);
            assertTrue(model.getValidationErrors().containsKey("email"));
            assertThrows(IllegalArgumentException.class, model::validate);
        }
    }

    @Test
    public void testValidLoginFormatPasses() {
        UserSignupFormModel model = new UserSignupFormModel(
                "Дмитро",
                "dmytro@test.ua",
                "dima_231"
        );

        assertTrue(model.isValid());
        assertNull(model.getValidationErrors().get("login"));
    }

    @Test
    public void testShortLoginFormatFails() {
        UserSignupFormModel model = new UserSignupFormModel(
                "Дмитро",
                "dmytro@test.ua",
                "dm"
        );

        assertFalse(model.isValid());
        assertTrue(model.getValidationErrors().containsKey("login"));
    }

    @Test
    public void testInvalidCharactersInLoginFails() {
        UserSignupFormModel model = new UserSignupFormModel(
                "Дмитро",
                "dmytro@test.ua",
                "user#$%"
        );

        assertFalse(model.isValid());
        assertTrue(model.getValidationErrors().containsKey("login"));
    }

    @Test
    public void testShortPasswordFails() {
        UserSignupFormModel model = new UserSignupFormModel(
                "Дмитро",
                "dmytro@test.ua",
                "pass1",
                "pass1",
                true
        );

        assertFalse(model.isValid());
        assertTrue(model.getValidationErrors().containsKey("password"));
    }

    @Test
    public void testPasswordMismatchFails() {
        UserSignupFormModel model = new UserSignupFormModel(
                "Дмитро",
                "dmytro@test.ua",
                "Secret123",
                "Secret999",
                true
        );

        assertFalse(model.isValid());
        assertTrue(model.getValidationErrors().containsKey("repeatPassword"));
    }

    @Test
    public void testUserDaoRejectsNullAndInvalidModelBeforeDatabaseCall() {
        IDbService mockDb = () -> {
            throw new AssertionError("Database should not be accessed for invalid model");
        };
        UserDao userDao = new UserDao(mockDb);

        assertThrows(IllegalArgumentException.class, () -> userDao.signupUser(null));

        UserSignupFormModel invalidModel = new UserSignupFormModel("", "invalid-email");
        assertThrows(IllegalArgumentException.class, () -> userDao.signupUser(invalidModel));
    }

    @Test
    public void testLoginUniquenessValidationInUserDao() throws SQLException {
        IDbService mockDb = () -> createMockConnection("existing_user");
        UserDao userDao = new UserDao(mockDb);

        UserSignupFormModel duplicateModel = new UserSignupFormModel(
                "Тарас",
                "taras.new@example.com",
                "existing_user",
                "Secret123",
                "Secret123",
                true
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            userDao.signupUser(duplicateModel);
        });
        assertTrue(ex.getMessage().contains("вже зайнятий"));

        UserSignupFormModel availableModel = new UserSignupFormModel(
                "Андрій",
                "andriy@example.com",
                "andriy_unique",
                "Secret123",
                "Secret123",
                true
        );

        assertDoesNotThrow(() -> userDao.signupUser(availableModel));
    }

    private Connection createMockConnection(String takenLogin) {
        return (Connection) Proxy.newProxyInstance(
                Connection.class.getClassLoader(),
                new Class<?>[]{Connection.class},
                (proxy, method, args) -> {
                    if ("prepareStatement".equals(method.getName())) {
                        final String[] boundParams = new String[2];
                        return Proxy.newProxyInstance(
                                PreparedStatement.class.getClassLoader(),
                                new Class<?>[]{PreparedStatement.class},
                                (pStmt, stmtMethod, stmtArgs) -> {
                                    if ("setString".equals(stmtMethod.getName())) {
                                        int idx = (Integer) stmtArgs[0];
                                        if (idx <= 2) {
                                            boundParams[idx - 1] = (String) stmtArgs[1];
                                        }
                                        return null;
                                    }
                                    if ("executeQuery".equals(stmtMethod.getName())) {
                                        boolean isTaken = takenLogin != null && (
                                                takenLogin.equalsIgnoreCase(boundParams[0]) ||
                                                takenLogin.equalsIgnoreCase(boundParams[1])
                                        );
                                        final int count = isTaken ? 1 : 0;
                                        return Proxy.newProxyInstance(
                                            ResultSet.class.getClassLoader(),
                                            new Class<?>[]{ResultSet.class},
                                            (rs, rsMethod, rsArgs) -> {
                                                if ("next".equals(rsMethod.getName())) {
                                                    return true;
                                                }
                                                if ("getInt".equals(rsMethod.getName())) {
                                                    return count;
                                                }
                                                if ("close".equals(rsMethod.getName())) {
                                                    return null;
                                                }
                                                return null;
                                            }
                                        );
                                    }
                                    if ("executeUpdate".equals(stmtMethod.getName())) {
                                        return 1;
                                    }
                                    if ("close".equals(stmtMethod.getName())) {
                                        return null;
                                    }
                                    return null;
                                }
                        );
                    }
                    if ("close".equals(method.getName())) {
                        return null;
                    }
                    return null;
                }
        );
    }
}
