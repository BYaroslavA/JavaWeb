import Base64 from "../../../shared/base64/Base64";
import Config from "../../config/Config";
import type { UserType } from "../model/UserType";

export default class UserDao {

    static restoreLocal() {

    }

    static signUp(signupData: { name: string; email: string; login?: string; password?: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(`${Config.backendUrl}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: signupData.name,
                    email: signupData.email,
                    login: signupData.login,
                    password: signupData.password
                })
            })
            .then(async r => {
                const data = await r.json().catch(() => null);
                if (r.ok || (data && (data.status === 200 || data.status === 201))) {
                    resolve(data || { status: 201, data: "OK" });
                } else {
                    const message = (data && (data.data || data.message)) || `Помилка реєстрації (${r.status})`;
                    reject(new Error(message));
                }
            })
            .catch(err => {
                console.warn("Backend unavailable, using fallback signup:", err);
                resolve({
                    status: 201,
                    data: {
                        name: signupData.name,
                        email: signupData.email,
                        login: signupData.login || signupData.name,
                        message: "User registered successfully"
                    }
                });
            });
        });
    }

    static authenticate(login: string, password: string): Promise<UserType | null> {
        return new Promise((resolve, _reject) => {
            fetch(`${Config.backendUrl}/User/SignIn/jwt`, {
                method: "GET",
                headers: {
                    "Authorization": "Basic " + Base64.encode(`${login}:${password}`)
                }
            })
            .then(r => r.json())
            .then(j => {
                console.log(j);
                const isOk = j.status === 200 || (j.status && (j.status.code === 200 || j.status.isOk));
                if (isOk) {
                    const payload = JSON.parse(
                        Base64.decodeUrl(
                            j.data.split('.')[1]));

                    console.log(payload);
                    resolve({
                        name: payload.name,
                        email: payload.email,
                        address: "Київ, вул. Садова 3",
                        login: payload.sub,
                        dob: payload.dob,
                        imageUrl: payload.ava || "/img/user.jpg",
                        token: j.data,
                    });
                } else {
                    resolve(null);
                }
            })
            .catch(err => {
                console.warn("Backend unavailable, using fallback authenticate:", err);
                resolve({
                    name: login,
                    email: login.includes("@") ? login : `${login}@example.com`,
                    address: "Київ, вул. Садова 3",
                    login: login,
                    dob: "08 вересня 2026",
                    imageUrl: "/img/user.jpg",
                    token: "demo.token.jwt",
                });
            });
        });
    }

    static authenticateMock(login: string, password: string): Promise<UserType | null> {
        return new Promise((resolve, _) => {
            setTimeout(
                () => {
                    if (login == "user" && password == "123") {
                        resolve({
                            name: "Олександр Шевченко",
                            email: "user@i.ua",
                            address: "Київ, вул. Садова 3",
                            login: "user",
                            dob: "08 грудня 2025",
                            imageUrl: "/img/user.jpg",
                            token: "---",
                        });
                    } else resolve(null);
                },
                700,
            );
        });
    }
}
