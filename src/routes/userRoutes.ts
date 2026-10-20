import { Router, type Request, type Response, type NextFunction } from 'express';
import provider from "../providers/providers.ts";

const router = Router();

router.get("/:user_id", (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = req.params.user_id;
        if (typeof user_id != "string") {
            res.status(400).send();
            return;
        }

        const user = provider.getUser(user_id);
        if (user == undefined) {
            res.status(404).send();
            return;
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
})

export default router;