import { Router, type Request, type Response, type NextFunction } from 'express';
import provider from "../providers/providers.ts";

// /api/user
const router = Router();

router.get("/:user_id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.params.user_id;
        if (typeof user_id != "string") {
            res.status(400).send();
            return;
        }

        const user = await provider.getUser(user_id);
        if (user == undefined) {
            res.status(404).json({
                status: 404,
                message: "User not found."
            });
            return;
        }

        res.json({
            status: 200,
            message: "",
            data: user,
        });
    } catch (error) {
        next(error);
    }
})

export default router;