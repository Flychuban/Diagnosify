import Title from "antd/es/typography/Title";
import { useState } from "react";

const Card: React.FC<{ disease: string; content: string }> = ({ disease, content }) => {
    const [shouldShowMore, setShouldShowMore] = useState(false);

    return (
        <div className="bg-primary p-4 rounded-md shadow-md">
            <Title>
                <p className="text-primarytext">{disease.toUpperCase()}</p>
            </Title>
            <div className="mt-2 text-primarytext text-2xl">
                <p>{shouldShowMore ? content : `${content.slice(0, 100)}...`}</p>
                <button
                    className="mt-2 text-blue-500 hover:underline"
                    onClick={() => setShouldShowMore(!shouldShowMore)}
                >
                    {shouldShowMore ? "Show less" : "Show more"}
                </button>
            </div>
        </div>
    );
};

export default function FAQ() {
const diseases = [
        {
            disease: "breast cancer",
            content: `Radius Mean: This is the average distance from the center of the nucleus to its perimeter. 
Larger mean radius values may indicate tumors that are more likely to be malignant due to their size and growth behavior.


Perimeter Mean: This measures the average length of the outline of the nucleus. Similar to radius, a larger perimeter could suggest a more aggressive or advanced tumor.


Area Mean: The average area covered by the nucleus. Larger nuclei areas are often associated with malignant tumors, reflecting rapid growth and potential aggressiveness of the cancer.


Compactness Mean: This is calculated as the perimeter squared divided by the area. It provides a measure of how compact the shape of the nucleus is. 
Higher compactness may indicate malignancy, as cancer cells often have irregular and compact shapes.


Concavity Mean: The average concavity in the contour of the nucleus. Tumors with higher concavity values may have more irregular shapes, which is a characteristic often associated with malignancy.


Concave Points Mean: This is the average number of concave portions of the contour of the nucleus. Nuclei with more concave points are generally more irregular and can indicate a higher likelihood of breast cancer.


Radius SE: The standard error of the radius measurements. A higher standard error could suggest variability in the tumor size, potentially indicating malignancy.


Perimeter SE: The standard error for the perimeter measurements. Like radius SE, a higher value may reflect irregularity and heterogeneity in tumor shape, often seen in malignant tumors.


Area SE: The standard error of the area measurements. Variability in the area can be an indicator of aggressive growth patterns typical of malignant tumors.


Radius Worst: The largest mean radius value recorded. Larger maximum radius values are strongly indicative of malignancy, reflecting the aggressive expansion of cancerous tumors.


Perimeter Worst: The largest perimeter measurement observed. This indicates the potential aggressiveness of the tumor; larger perimeters are often seen in malignant cases.


Area Worst: The largest area of the nucleus among the samples. A larger maximum area is a critical indicator of malignancy due to rapid tumor growth.


Compactness Worst: The worst case (highest) of the compactness measurements. Higher values indicate a denser, more irregular tumor, which is a common characteristic of malignant breast cancer.


Concavity Worst: The highest concavity observed. Significant concavity suggests a highly irregular and potentially aggressive tumor, which is characteristic of malignant breast cancer.


Concave Points Worst: The maximum number of concave points measured. An increased number of concave points in the worst case suggests a high level of tumor irregularity and is associated with a higher likelihood of breast cancer.`
        },
        {
            disease: "diabetes",
            content: `
            Pregnancies: The number of pregnancies a person has had can affect the risk of developing gestational diabetes during pregnancy and type 2 diabetes later in life. 
Women with a history of gestational diabetes are at a higher risk of developing type 2 diabetes.

Glucose: Glucose levels, typically measured after fasting, are crucial for diagnosing diabetes. High fasting glucose levels can indicate impaired fasting glucose, prediabetes, or diabetes. 
Maintaining glucose levels within a normal range is essential for managing diabetes and reducing the risk of complications.


Blood Pressure (BP): High blood pressure, or hypertension, can exacerbate the risk of developing diabetes-related complications, 
such as cardiovascular disease and kidney damage. Monitoring and controlling BP is vital for people with diabetes.


Skin Thickness: The thickness of the skin at the triceps can be an indicator of insulin resistance when measured as part of a skinfold test. 
Higher measurements may be associated with greater insulin resistance, a condition that often precedes type 2 diabetes.


Insulin: The level of insulin, a hormone that regulates blood glucose, in the body can provide insight into how the body is managing glucose. 
Low levels of insulin or a resistance to insulin's effects are key characteristics of type 2 diabetes.


BMI (Body Mass Index): BMI is a measure of body fat based on height and weight. Overweight and obesity are significant risk factors for developing type 2 diabetes. 
Managing body weight can help prevent the onset of diabetes or manage the condition more effectively.
            `
        },
        {
            disease: "heart-disease",
            content: `
            Age: Age is a significant risk factor for heart disease, with the risk increasing as individuals get older.

Gender: Gender (male or female) can influence the risk profile for heart disease. Men tend to have a higher risk of heart disease at a younger age, while women's risk increases after menopause.

Chest Pain (CP): The type of chest pain experienced by an individual can provide important information for heart disease diagnosis. Certain types of chest pain, such as angina, may indicate a higher likelihood of heart disease.

Resting Blood Pressure (trestbps): High blood pressure (hypertension) is a major risk factor for heart disease. Monitoring resting blood pressure levels is crucial in assessing the risk of developing heart disease.

Cholesterol Levels (chol): Elevated levels of LDL cholesterol (often referred to as "bad" cholesterol) and low levels of HDL cholesterol ("good" cholesterol) are associated with an increased risk of heart disease.

Fasting Blood Sugar (fbs): High fasting blood sugar levels can indicate the presence of diabetes, which is a risk factor for heart disease.

Resting Electrocardiographic Results (restecg): The resting electrocardiogram (ECG) results can provide insights into the electrical activity of the heart and help identify abnormalities that may be indicative of heart disease.

Maximum Heart Rate Achieved (thalach): The maximum heart rate achieved during exercise can provide valuable information about cardiovascular fitness and potential heart disease risks.

Exercise-Induced Angina (exang): The presence of angina (chest pain) during exercise can indicate underlying heart disease.

ST Depression Induced by Exercise Relative to Rest (oldpeak): The amount of ST segment depression observed on an ECG during exercise can indicate the presence of myocardial ischemia, which is a sign of impaired blood flow to the heart.

Slope of the Peak Exercise ST Segment (slope): The slope of the ST segment during exercise can provide additional information about the severity and progression of heart disease.

Number of Major Vessels Colored by Fluoroscopy (ca): The number of major blood vessels showing blockages or narrowing, as determined by fluoroscopy, can help assess the extent of coronary artery disease.

Thalassemia (thal): Thalassemia is an inherited blood disorder that can affect the oxygen-carrying capacity of red blood cells. Certain types of thalassemia may be associated with an increased risk of heart disease.


age
gender
chest pain type (4 values)
resting blood pressure
serum cholestoral in mg/dl
fasting blood sugar > 120 mg/dl
resting electrocardiographic results (values 0,1,2)
maximum heart rate achieved
exercise induced angina
oldpeak = ST depression induced by exercise relative to rest
the slope of the peak exercise ST segment
number of major vessels (0-3) colored by flourosopy
thal: 0 = normal; 1 = fixed defect; 2 = reversable defect
            `
        },
        {
            disease: "kidney disease",
            content: `
            Specific Gravity: A measure of the density of urine compared to water. It can indicate the kidney's ability to concentrate urine. 
Abnormal values may suggest kidney dysfunction, as healthy kidneys typically filter waste to concentrate urine without losing too much or too little water.


Albumin: A protein that can pass into the urine when the kidneys are damaged. Normally, the kidneys prevent large molecules like albumin from being lost. 
However, kidney damage can allow albumin to leak into the urine, a condition known as albuminuria, which is an early sign of kidney disease.


Serum Creatinine: A waste product from the normal breakdown of muscle tissue that the kidneys should filter out. 
High levels in the blood can indicate impaired kidney function, as they suggest the kidneys are not effectively removing creatinine from the bloodstream.


Hemoglobin: A protein in red blood cells that carries oxygen. Low hemoglobin levels can be a sign of anemia, which is common in kidney disease. 
The kidneys produce erythropoietin, a hormone that stimulates red blood cell production, and damage can lead to decreased erythropoietin and anemia.


PCV (Packed Cell Volume): Measures the volume percentage of red blood cells in blood. A low PCV indicates anemia, while a high PCV could suggest dehydration. 
In the context of kidney disease, a low PCV can indicate erythropoietin deficiency due to kidney dysfunction.


Hypertension: High blood pressure is both a cause and a complication of chronic kidney disease. The kidneys help regulate blood pressure by controlling the volume of blood 
and the amount of blood vessel constriction. When the kidneys are damaged, they may not perform these functions properly, leading to increased blood pressure.
            `
        },
        {
            disease: "liver disease",
            content: `
            Age: Age can be a significant factor in liver disease, as the risk of developing conditions such as cirrhosis, liver cancer, and other liver-related problems can increase with age. 
This is due to the cumulative effect of liver injury over time from various causes such as alcohol use, obesity, and viral hepatitis.


Gender: Gender can influence the risk profile for liver diseases. For instance, men may have a higher risk of liver disease related to alcohol consumption, 
while women might be more susceptible to autoimmune liver diseases. Hormonal differences can also affect disease progression and outcomes.


Total Bilirubin: Bilirubin is a yellow pigment formed by the breakdown of red blood cells. Elevated levels of total bilirubin can indicate liver dysfunction, 
as the liver is responsible for bilirubin's processing and excretion. High bilirubin levels can lead to jaundice, which is a common symptom of liver disease.


Direct Bilirubin: Direct bilirubin is a portion of total bilirubin that is processed by the liver and directly excreted into the bile. 
Elevated levels can suggest liver damage or bile duct obstruction, providing insight into the nature and location of liver dysfunction.


Alkaline Phosphatase (ALP): ALP is an enzyme found in various tissues, with high concentrations in the liver, bile ducts, and bones. 
High levels of ALP can indicate liver damage or diseases related to the bile ducts, such as blockages or inflammation.


Alamine Aminotransferase (ALT): ALT is an enzyme primarily found in the liver. It plays a role in converting proteins into energy for liver cells. 
Elevated ALT levels are a sensitive indicator of liver cell injury, often seen in conditions like hepatitis.


Aspartate Aminotransferase (AST): AST is an enzyme found in the liver and other organs. High levels of AST can indicate liver damage but are less specific to the liver than ALT. 
AST to ALT ratio can also provide insights into the causes of liver injury.


Total Proteins: This measure includes all the proteins in the blood, including albumin and globulin. Abnormal levels can indicate liver disease, as the liver is crucial for protein synthesis. 
Low levels may suggest liver dysfunction or damage.


Albumin: Albumin is the most abundant protein made by the liver, and it plays a critical role in maintaining blood volume and pressure. 
Low albumin levels can indicate chronic liver disease, as it suggests the liver's synthetic function is impaired.


Albumin/Globulin (AG) Ratio: This ratio compares levels of albumin to globulin, another type of protein. An abnormal AG ratio can indicate liver disease, kidney disease, or other conditions. 
It is particularly useful in assessing liver function and nutritional status.
            `
        },
        {
            disease: "parkinson",
            content: `
            MDVP:Jitter(%): Measures the variation in the frequency or pitch of the voice signal, expressed as a percentage. 
Higher values may indicate greater vocal instability, which is common in Parkinson's disease due to impaired vocal cord control.


MDVP:Jitter(Abs): The absolute difference in consecutive periods of the vocal frequency, indicating pitch variation. 
Smaller values are typical in healthy speech, while larger values suggest more pronounced vocal tremor or instability.


MDVP:RAP: The Relative Amplitude Perturbation measures the variation in the amplitude of the voice. 
It reflects how much the amplitude varies in a short time, with higher values indicating more variability and potential vocal cord dysfunction.


MDVP:PPQ: The Pitch Period Perturbation Quotient is another measure of the variability in pitch, but calculated over a longer timeframe than RAP. 
Increased values can signify more pronounced speech irregularities associated with Parkinson's disease.


Jitter:DDP: A measure of cycle-to-cycle variability in vocal fold vibration, indicating irregularities in the voice signal. 
DDP stands for Difference of Differences of Periods, highlighting more detailed aspects of jitter over time.


MDVP:Shimmer: Reflects the variation in loudness or amplitude of the voice signal. Higher levels of shimmer suggest greater amplitude variability, which can be a sign of vocal fold dysfunction.


MDVP:Shimmer(dB): The decibel difference in the amplitude variation, providing an intensity perspective to shimmer. 
Increases in this measure can indicate a loss of control over voice amplitude, seen in Parkinson’s disease.


Shimmer:APQ3: Amplitude Perturbation Quotient for 3 cycles, measuring the variability in amplitude across three vocal cycles. 
It helps quantify the dynamic changes in voice amplitude, where higher values denote more variability.


Shimmer:APQ5: Similar to APQ3, but measures amplitude variability over five cycles. 
Both APQ3 and APQ5 offer insights into the consistency of vocal amplitude, important for detecting speech abnormalities.


MDVP:APQ: The overall Amplitude Perturbation Quotient, representing general amplitude variability in the voice. A broader measure compared to APQ3 and APQ5, indicating global amplitude fluctuations.


Shimmer:DDA: Another measure of amplitude variability, calculated similarly to APQ3 but over different cycles. It reinforces the assessment of vocal instability and amplitude variation.


NHR (Noise to Harmonics Ratio): Indicates the ratio of noise in the voice signal to the harmonics. Higher NHR values can signify a more raspy and breathy voice, often associated with Parkinson’s disease.


HNR (Harmonics to Noise Ratio): The inverse of NHR, showing the ratio of harmonic components to noise components in the voice. Lower HNR values are typical in disordered speech, including that affected by Parkinson's disease.


RPDE (Recurrence Period Density Entropy): A measure of the dynamic complexity of the voice signal, capturing the recurrence behavior of the signal over time. Abnormalities in RPDE may indicate neurological impairments affecting speech.


DFA (Detrended Fluctuation Analysis): Analyzes the signal for self-similarity or fractal patterns. Changes in DFA values can reflect alterations in speech production control, potentially due to Parkinson’s disease.


PPE (Pitch Period Entropy): Quantifies the variability in the pitch period, providing insight into the regularity and complexity of the vocal signal. 
Higher PPE values can indicate more erratic speech patterns characteristic of Parkinson's disease.


            `
        }
    ]



    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-black">
            {diseases.map(({ disease, content }, index) => (
                <Card key={index} disease={disease} content={content} />
            ))}
        </div>
    );
}
