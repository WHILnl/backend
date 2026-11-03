import { Router, type Request, type Response, type NextFunction } from 'express';
import provider from "../providers/providers.ts";

// /api/timetable
const router = Router();

router.get("/:user_id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.params.user_id;
        if (typeof user_id != "string") {
            res.status(400).send();
            return;
        }

        const timetable = await provider.getTimetable(user_id);
        if (timetable == undefined) {
            res.status(404).json({
                status: 404,
                message: "Timetable not found."
            });
            return;
        }

        res.json({
            status: 200,
            message: "",
            data: timetable,
        });
    } catch (error) {
        next(error);
    }
})

export default router;