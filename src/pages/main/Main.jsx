import "./main.scss"
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from "react";
import GradeInput from "../../components/gradeInput/GradeInput";
import { Button } from "@mui/material";
import Result from "../../components/result/Result";
import ErrorPrompt from "../../components/errorPrompt/ErrorPromp";

function Main() {
    const [showHelp,setShowHelp] = useState(false);
    const [firstYearWeights,setFirstYearWeights] = useState([0,0,0,0,0,0,0,0])
    const [secondYearWeights,setSecondYearWeights] = useState([0,0,0,0,0,0,0,0])
    const [thirdYearWeights,setThirdYearWeights] = useState([0,0,0,0,0,0,0,0])
    const [result, setResult] = useState(null);
    const [resultBreakDown, setResultBreakDown] = useState(<div></div>);
    const [invalidInput, setInvalidInput] = useState(false);
    

    const setWeight = (type , index, value)=>{
        switch(type){
            case "First":
                firstYearWeights[index] = value;
                setFirstYearWeights(firstYearWeights)
                break;
            case "Second":
                secondYearWeights[index] = value;
                setSecondYearWeights(secondYearWeights)
                break;
            case "Third":
                thirdYearWeights[index] = value;
                setThirdYearWeights(thirdYearWeights)
                break;
        
            default:
                break;
        }
    }

    const classificationFunction = (grade)=>{
        if(grade>=70) return "First Class"
        if(grade>=60) return "Second Class Upper Division (2.1)"
        if(grade>=50) return "Second Class Lower Division (2.2)"
        if(grade>=40) return "Third class"

        return "Fail"
    }

    const checkTwoPercentRule = (grade,credits)=>{
        if(grade<70 && grade+2>=70 && credits>=120) return true;
        if(grade<60 && grade+2>=60 && credits>=120) return true;
        if(grade<50 && grade+2>=50 && credits>=120) return true;
        if(grade<40 && grade+2>=40 && credits>=120) return true;
        return false;
    }

    const applyTwoPercentRule = (grade)=>{
        if(grade<70 && grade+2>=70) return 70;
        if(grade<60 && grade+2>=60) return 60;
        if(grade<50 && grade+2>=50) return 50;
        if(grade<40 && grade+2>=40 ) return 40;
        return grade;
    }

    const calculateGrade = ()=>{
        setInvalidInput(false);
        const firstYearWeightsSorted = [...firstYearWeights].sort((a,b)=>b-a)
        const secondYearWeightsSorted = [...secondYearWeights].sort((a,b)=>b-a)
        const thirdYearWeightsSorted = [...thirdYearWeights].sort((a,b)=>b-a)

        let firstYearTotal = 0;
        let firstYearCreditTotal = 0;
        for(let i=0; i<6; i++){
            let credit = Number(firstYearWeightsSorted[i]);
            //Check valid inputs
            if(credit<0 || credit>100 || !Number.isInteger(credit)){
                console.log(credit)
                setInvalidInput(true);
                return;
            }

            firstYearTotal+=credit;
            firstYearCreditTotal+=credit*0.15;
        }
        let secondYearTotal = 0;
        let secondYearCreditTotal = 0;
        for(let i=0; i<7; i++){
            let credit = Number(secondYearWeightsSorted[i]);
            //Check valid inputs
            if(credit<0 || credit>100 || !Number.isInteger(credit)){
                setInvalidInput(true);
                return;
            }

            secondYearTotal+=credit;
            secondYearCreditTotal+=credit*0.15;
        }
        secondYearTotal*=3;
        let thirdYearTotal = 0;
        let thirdYearCreditTotal = 0;
        for(let i=0; i<7; i++){
            let credit = Number(thirdYearWeightsSorted[i]);
            //Check valid inputs
            if(credit<0 || credit>100 || !Number.isInteger(credit)){
                setInvalidInput(true);
                return;
            }

            thirdYearTotal+=credit;
            thirdYearCreditTotal+=credit*0.15;
        }
        thirdYearTotal*=5;

        let weightedTotal1 = Math.round((firstYearTotal+secondYearTotal+thirdYearTotal)/62)
        let weightedTotal2 = Math.round((secondYearTotal+thirdYearTotal)/56)
        let finalGrade = Math.max(weightedTotal1,weightedTotal2);
        let breakdown = (<div></div>)
   
        if(checkTwoPercentRule(finalGrade,secondYearCreditTotal+thirdYearCreditTotal)){
            finalGrade = applyTwoPercentRule(finalGrade)
            breakdown=(<div>
                <div className="breakdown">
                Level 4 (first year) = {firstYearWeightsSorted.slice(0,6).join(" + ")} = <b>{firstYearTotal}</b> (or 0)<br/>
                Level 5 (second year) = {secondYearWeightsSorted.slice(0,7).join(" + ")} = <b>{secondYearTotal/3}</b><br/>
                Level 6 (third year) = {thirdYearWeightsSorted.slice(0,7).join(" + ")} = <b>{thirdYearTotal/5}</b>
                </div>
                
                <div className="breakdown">
                The result for Level 4 is multiplied by 1:<br/>
                {firstYearTotal} * 1 = <b>{firstYearTotal}</b>
                </div>
                
                <div className="breakdown">
                The result for Level 5 is multiplied by 3:<br/>
                {secondYearTotal/3} * 3 = <b>{secondYearTotal}</b>
                </div>

                <div className="breakdown">
                The result for Level 5 is multiplied by 5:<br/>
                {thirdYearTotal/5} * 5 = <b>{thirdYearTotal}</b>
                </div>

                <div className="breakdown">
                (Including level 4) Add all together and divide by 62:<br/>
                ({firstYearTotal} + {secondYearTotal} + {thirdYearTotal})/62 = <b>{weightedTotal1}</b> (to the nearest whole number) 
                </div>

                <div className="breakdown">
                (Discounting Level 4) Add all together and divide by 56:<br/>
                ({secondYearTotal} + {thirdYearTotal})/56 = <b>{weightedTotal2}</b> (to the nearest whole number) 
                </div>

                <div className="breakdown">
                According to <b><a href="https://www.gold.ac.uk/media/docs/gam/Progression-and-Award-for-Students-on-Taught-Programmes.pdf" className="link">rogression and Award for
Students on Taught Programmes 9.3.6</a></b> you will automatically be  awarded the higher classification:<br/>
            <b>*{finalGrade} = {classificationFunction(Math.max(weightedTotal1,weightedTotal2))}</b>
                </div>

                </div>
                )

        
        }else{
            breakdown=(<div>
                        <div className="breakdown">
                        Level 4 (first year) = {firstYearWeightsSorted.slice(0,6).join(" + ")} = <b>{firstYearTotal}</b> (or 0)<br/>
                        Level 5 (second year) = {secondYearWeightsSorted.slice(0,7).join(" + ")} = <b>{secondYearTotal/3}</b><br/>
                        Level 6 (third year) = {thirdYearWeightsSorted.slice(0,7).join(" + ")} = <b>{thirdYearTotal/5}</b>
                        </div>
                        
                        <div className="breakdown">
                        The result for Level 4 is multiplied by 1:<br/>
                        {firstYearTotal} * 1 = <b>{firstYearTotal}</b>
                        </div>
                        
                        <div className="breakdown">
                        The result for Level 5 is multiplied by 3:<br/>
                        {secondYearTotal/3} * 3 = <b>{secondYearTotal}</b>
                        </div>

                        <div className="breakdown">
                        The result for Level 5 is multiplied by 5:<br/>
                        {thirdYearTotal/5} * 5 = <b>{thirdYearTotal}</b>
                        </div>

                        <div className="breakdown">
                        (Including level 4) Add all together and divide by 62:<br/>
                        ({firstYearTotal} + {secondYearTotal} + {thirdYearTotal})/62 = <b>{weightedTotal1}</b> (to the nearest whole number) 
                        </div>

                        <div className="breakdown">
                        (Discounting Level 4) Add all together and divide by 56:<br/>
                        ({secondYearTotal} + {thirdYearTotal})/56 = <b>{weightedTotal2}</b> (to the nearest whole number) 
                        </div>

                        <div className="breakdown">
                        <b>*{finalGrade} = {classificationFunction(Math.max(weightedTotal1,weightedTotal2))}</b>
                        </div>
                        </div>
                        )
        }
        
        setResult(finalGrade);
        setResultBreakDown(breakdown);      
    }
    return (
    <div className="parent">
        <div className="container">
            <div className="title">Goldsmiths Grade Calculator 2022</div>
            <div className="author">By Muneeb Rehman</div>
            <div className="infoBox">
            This is the unoffocial remaster of <a className="link" href="http://gold.zarino.co.uk/">zarino`s Grade calculator</a> made using React. This website is not run or maintained by Goldsmiths, but is based on the college's official undergraduate <a className="link" href="https://www.gold.ac.uk/students/assessments/undergraduate-final-result-calculation/">final result calculations</a>. 
            </div>
            {result!=null && <Result result={result} breakdown={resultBreakDown} classification={classificationFunction(result)}/>}
            {invalidInput && <ErrorPrompt/>}
            
            <div className="subHeading">Enter up to 8 credits marks for each year you've studied</div>
            <div className="helpButton" onClick={()=>setShowHelp(!showHelp)}>{!showHelp? <ArrowRightIcon/>:<ArrowDropDownIcon/>} Need help?</div>
            <div className="helpBox" style={{display:showHelp?"block":"none"}}>
                <ul>
                    <li>A “credit mark” is the mark you were awarded for completing a module (eg: the mark you were given for your module’s final essay, usually a number around 50–70).</li>
                    <li>Each year of your course counts for 120 “credits”. This might be in the form of eight 15-credit modules. Or it might include some 30-credit modules (eg: practical modules for Media & Comms students).</li>
                    <li>If your course includes one of these double-strength modules, you should enter the credit mark for that module twice in the boxes below.</li>
                    <li>Your final grade will be calculated from the 90 best credit (or no credits) marks from your first year, the 105 best credit marks from your second year, and the 105 best credit marks from your third year. <a className="link" href="https://www.gold.ac.uk/students/assessments/undergraduate-final-result-calculation/">For more information see the official guidance.</a></li>
                    <li>If you are not sure </li>
                </ul>
            </div>
            <GradeInput setWeightFunction ={setWeight} year="First"/>
            <GradeInput setWeightFunction ={setWeight} year="Second"/>
            <GradeInput setWeightFunction ={setWeight} year="Third"/>

            <Button className="calculateButton" onClick={()=>calculateGrade()} variant="outlined">Calculate my grade</Button>

        </div>
        <footer>
            <div className="container">
            This calculator assumes grade boundaries of: 70% for a 1st, 60% for a 2:1, 50% for a 2:2, 40% for a 3rd.
            <br />
            The calculator code can be viewed at <a href="https://github.com/mrehmm001/Grade_calculator" className="link">Github</a>.

            <div className="trademark">@2022 Muneeb Rehman</div>
            </div>
        </footer>

    </div> );
}

export default Main;