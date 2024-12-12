import { hotnessRepo } from './../db/repositories/hotnessRepo';
import express from "express"

await hotnessRepo.connect()
export const hotnessRouter = express.Router();

hotnessRouter.get("/:diagnosisId", async (
    req: express.Request<{ diagnosisId: string }, {}, {}>,
    res: express.Response<{ hotness: number } | {err: string}>
) => {
    if (!req.params.diagnosisId) {
        return res.status(407).json({
            err: "no diagnosis id provided"
        })
    }
    const diagnosisId = req.params.diagnosisId;
    const hotness = await hotnessRepo.getHotness((diagnosisId));
    res.json({ hotness });
})

hotnessRouter.post("/:diagnosisId", async(
    req: express.Request<{ diagnosisId: string }, {}, {}>,
    res: express.Response<{} | {err: string}>
) => {
    if (!req.params.diagnosisId) { 
        return res.status(407).json({
            err: "no diagnosis id provided"
        })
    }
    hotnessRepo.oneUpHotness(req.params.diagnosisId)
    return res.status(200).json({})
})