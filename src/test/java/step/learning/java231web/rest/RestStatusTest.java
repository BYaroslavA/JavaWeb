package step.learning.java231web.rest;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RestStatusTest {

    @Test
    public void testStandardSuccessStatuses() {
        assertTrue(RestStatus.Ok.isOk());
        assertEquals(200, RestStatus.Ok.getCode());
        assertEquals("OK", RestStatus.Ok.getMessage());

        assertTrue(RestStatus.Created.isOk());
        assertEquals(201, RestStatus.Created.getCode());
        assertEquals("Created", RestStatus.Created.getMessage());

        assertTrue(RestStatus.Accepted.isOk());
        assertEquals(202, RestStatus.Accepted.getCode());

        assertTrue(RestStatus.NoContent.isOk());
        assertEquals(204, RestStatus.NoContent.getCode());
    }

    @Test
    public void testStandardClientErrorStatuses() {
        assertFalse(RestStatus.BadRequest.isOk());
        assertEquals(400, RestStatus.BadRequest.getCode());
        assertEquals("Bad Request", RestStatus.BadRequest.getMessage());

        assertFalse(RestStatus.Unauthorized.isOk());
        assertEquals(401, RestStatus.Unauthorized.getCode());

        assertFalse(RestStatus.Forbidden.isOk());
        assertEquals(403, RestStatus.Forbidden.getCode());

        assertFalse(RestStatus.NotFound.isOk());
        assertEquals(404, RestStatus.NotFound.getCode());

        assertFalse(RestStatus.MethodNotAllowed.isOk());
        assertEquals(405, RestStatus.MethodNotAllowed.getCode());

        assertFalse(RestStatus.Conflict.isOk());
        assertEquals(409, RestStatus.Conflict.getCode());

        assertFalse(RestStatus.UnprocessableEntity.isOk());
        assertEquals(422, RestStatus.UnprocessableEntity.getCode());

        assertFalse(RestStatus.TooManyRequests.isOk());
        assertEquals(429, RestStatus.TooManyRequests.getCode());
    }

    @Test
    public void testStandardServerErrorStatuses() {
        assertFalse(RestStatus.InternalServerError.isOk());
        assertEquals(500, RestStatus.InternalServerError.getCode());

        assertFalse(RestStatus.NotImplemented.isOk());
        assertEquals(501, RestStatus.NotImplemented.getCode());

        assertFalse(RestStatus.BadGateway.isOk());
        assertEquals(502, RestStatus.BadGateway.getCode());

        assertFalse(RestStatus.ServiceUnavailable.isOk());
        assertEquals(503, RestStatus.ServiceUnavailable.getCode());
    }

    @Test
    public void testNonStandardStatusesFromLecture() {
        assertFalse(RestStatus.HeaderRequired.isOk());
        assertEquals(440, RestStatus.HeaderRequired.getCode());
        assertEquals("Header Required", RestStatus.HeaderRequired.getMessage());

        assertFalse(RestStatus.HeaderMalformed.isOk());
        assertEquals(441, RestStatus.HeaderMalformed.getCode());
        assertEquals("Header Malformed", RestStatus.HeaderMalformed.getMessage());

        assertFalse(RestStatus.QueryParameterRequired.isOk());
        assertEquals(442, RestStatus.QueryParameterRequired.getCode());
        assertEquals("Query Parameter Required", RestStatus.QueryParameterRequired.getMessage());
    }

    @Test
    public void testProposedNonStandardStatusesForHomework() {
        assertFalse(RestStatus.QueryParamInvalid.isOk());
        assertEquals(443, RestStatus.QueryParamInvalid.getCode());
        assertEquals("Query Parameter Invalid", RestStatus.QueryParamInvalid.getMessage());

        assertFalse(RestStatus.AuthTokenMissing.isOk());
        assertEquals(444, RestStatus.AuthTokenMissing.getCode());

        assertFalse(RestStatus.AuthTokenExpired.isOk());
        assertEquals(445, RestStatus.AuthTokenExpired.getCode());

        assertFalse(RestStatus.AuthTokenInvalid.isOk());
        assertEquals(446, RestStatus.AuthTokenInvalid.getCode());

        assertFalse(RestStatus.ModelValidationFailed.isOk());
        assertEquals(447, RestStatus.ModelValidationFailed.getCode());

        assertFalse(RestStatus.UserAlreadyExists.isOk());
        assertEquals(448, RestStatus.UserAlreadyExists.getCode());

        assertFalse(RestStatus.CaptchaRequired.isOk());
        assertEquals(449, RestStatus.CaptchaRequired.getCode());

        assertFalse(RestStatus.AccountDeactivated.isOk());
        assertEquals(450, RestStatus.AccountDeactivated.getCode());

        assertFalse(RestStatus.DbExecutionFailed.isOk());
        assertEquals(550, RestStatus.DbExecutionFailed.getCode());

        assertFalse(RestStatus.ThirdPartyServiceError.isOk());
        assertEquals(551, RestStatus.ThirdPartyServiceError.getCode());
    }

    @Test
    public void testCustomStatusCreationAndChaining() {
        RestStatus custom = new RestStatus()
                .setOk(true)
                .setCode(200)
                .setMessage("Custom OK");

        assertTrue(custom.isOk());
        assertEquals(200, custom.getCode());
        assertEquals("Custom OK", custom.getMessage());

        RestStatus another = new RestStatus(true, 200, "Custom OK");
        assertEquals(custom, another);
        assertEquals(custom.hashCode(), another.hashCode());
        assertTrue(custom.toString().contains("Custom OK"));
    }
}
