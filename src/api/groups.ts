import { Group } from "dataTypes";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

export function createGroup(payload: Group) {
    return new Promise((resolve, reject) => {
        fetch(`${endpoint}/groups`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            })
            .then((resp) => resp.json())
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });
}

export function getGroups(payload: Group) {
    return new Promise((resolve, reject) => {
        fetch(`${endpoint}/groups`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        .then((resp) => resp.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err))
    });
}