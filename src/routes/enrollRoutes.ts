import { Router, type Request, type Response, type NextFunction } from 'express';


const router = Router()

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json("hi")
    } catch (error) {
        next(error)
    }
})

export default router;