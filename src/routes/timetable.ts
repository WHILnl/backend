// path: /timetable
import type { Provider } from "@/types.js";
import { Status } from "@/types.js";
import { Router } from "express";

export default function (provider: Provider): Router {
    const router = Router();

    router.get("/:user", (req, res) => {
        let timetable = provider.getTimetable(req.params.user);
        if (timetable == undefined) {
            res.status(Status.NotFound).send()
        }
        res.json(timetable)
    })

    return router
}