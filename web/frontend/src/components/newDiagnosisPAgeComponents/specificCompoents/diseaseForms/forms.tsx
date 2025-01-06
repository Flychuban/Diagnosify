import { PredictionForm } from "~/components/universal_components/PredictionForm";
import { saveImageDataTextResponse } from "~/pages/diagnoses/new";
import { Env } from "~/utils/env";


const mlPredictionUrl = Env.prediction_service_url

export const PneumoniaPredictionForm: React.FC = () => {
  return (
    <PredictionForm<
      object,
      { prediction: { message: string; confidence: string } }
    >
      title="Pneumonia Prediction"
      endpoint={`${mlPredictionUrl}/predict_pneumonia`}
      componentToDisplayPrediction={(data) => <div>{JSON.stringify(data)}</div>}
      anotherComponentToDisplayPrediction={(data) => {
        return (
          <div>
            <p>prediction : {data.prediction.message}</p>
            <p>confidence: {data.prediction.confidence}</p>
          </div>
        );
      }}
      savePrediction={async (
        data,
        directVoteWhichSkipsVoting: boolean | null,
        vote: boolean,
        description: string,
      ) => {
        return await saveImageDataTextResponse(
          "pneumonia",
          data,
          directVoteWhichSkipsVoting,
          vote,
          description,
        );
      }}
    />
  );
};

export const CancerPredictionForm: React.FC = () => {
  return (
    <PredictionForm<object, { s3_loc: string }>
      title="Cancer Prediction"
      endpoint={`${mlPredictionUrl}/cancer-segmentation`}
      componentToDisplayPrediction={(data) => <div>{data}</div>}
      anotherComponentToDisplayPrediction={(data) => {
        return (
          <div>
            <img src={data.s3_loc} />
          </div>
        );
      }}
      savePrediction={async (
        data,
        directVoteWhichSkipsVoting: boolean | null,
        vote: boolean,
        description: string
      ) => {
        return await saveImageDataTextResponse(
          "canc",
          data,
          directVoteWhichSkipsVoting,
            vote,
          description
        );
      }}
    />
  );
};
export const MAlari = () => {
  return (
    <PredictionForm<
      { prediction: { message: string; malaria_probability: string } },
      { prediction: { message: string; malaria_probability: string } }
    >
      title="Malaria Prediction"
      endpoint={`${mlPredictionUrl}/predict-malaria`}
      componentToDisplayPrediction={(data: { message: string }) => (
        <div>{data.message}</div>
      )}
      anotherComponentToDisplayPrediction={(data) => {
        return (
          <div>
            <p>{data.prediction.message} </p>
            <p> {data.prediction.malaria_probability} </p>
          </div>
        );
      }}
      savePrediction={async (
        data,
        directVoteWhichSkipsVoting: boolean | null,
          vote: boolean,
        description: string,
      ) => {
        return await saveImageDataTextResponse(
          "malaria",
          data,
          directVoteWhichSkipsVoting,
            vote,
          description
        );
      }}
    />
  );
};
