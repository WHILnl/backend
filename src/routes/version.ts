// path: /version
import type { Provider } from "@/types.d.ts";
import { Router } from "express";

export default function (provider: Provider): Router {
    const router = Router();

    router.get("/", (req, res) => {
        res.json({ "version": process.env.VERSION })
    })
    return router
}