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

    const checkTwoPercentRule = (grade,weights)=>{
        if(grade<70 && grade+2>=70){
            weights = weights.filter(x=>x>=70).map(x=>x=15).reduce((partialSum, a) => partialSum + a, 0);
            return weights>=120;
        }if(grade<60 && grade+2>=60){
            weights = weights.filter(x=>x>=60).map(x=>x=15).reduce((partialSum, a) => partialSum + a, 0);
            return weights>=120;
        }if(grade<50 && grade+2>=50){
            weights = weights.filter(x=>x>=50).map(x=>x=15).reduce((partialSum, a) => partialSum + a, 0);
            return weights>=120;
        }if(grade<40 && grade+2>=40){
            weights = weights.filter(x=>x>=60).map(x=>x=15).reduce((partialSum, a) => partialSum + a, 0);
            return weights>=120;
        }
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
        for(let i=0; i<6; i++){
            let credit = Number(firstYearWeightsSorted[i]);
            //Check valid inputs
            if(credit<0 || credit>100 || !Number.isInteger(credit)){
                console.log(credit)
                setInvalidInput(true);
                return;
            }

            firstYearTotal+=credit;
        }
        let secondYearTotal = 0;
        for(let i=0; i<6; i++){
            let credit = Number(secondYearWeightsSorted[i]);
            //Check valid inputs
            if(credit<0 || credit>100 || !Number.isInteger(credit)){
                setInvalidInput(true);
                return;
            }

            secondYearTotal+=credit;
        }
        secondYearTotal*=3;
        let thirdYearTotal = 0;
        for(let i=0; i<7; i++){
            let credit = Number(thirdYearWeightsSorted[i]);
            //Check valid inputs
            if(credit<0 || credit>100 || !Number.isInteger(credit)){
                setInvalidInput(true);
                return;
            }

            thirdYearTotal+=credit;
        }
        thirdYearTotal*=5;

        let weightedTotal1 = Math.round((firstYearTotal+secondYearTotal+thirdYearTotal)/59)
        let weightedTotal2 = Math.round((secondYearTotal+thirdYearTotal)/53)
        let finalGrade = Math.max(weightedTotal1,weightedTotal2);
        let breakdown = (<div></div>)
   
        if(checkTwoPercentRule(finalGrade,[...secondYearWeightsSorted,...thirdYearWeightsSorted])){
            finalGrade = applyTwoPercentRule(finalGrade)
            breakdown=(<div>
                <div className="breakdown">
                Level 4 (first year) = {firstYearWeightsSorted.slice(0,6).join(" + ")} = <b>{firstYearTotal}</b> (or 0)<br/>
                Level 5 (second year) = {secondYearWeightsSorted.slice(0,6).join(" + ")} = <b>{secondYearTotal/3}</b><br/>
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
                (Including level 4) Add all together and divide by 59:<br/>
                ({firstYearTotal} + {secondYearTotal} + {thirdYearTotal})/59 = <b>{weightedTotal1}</b> (to the nearest whole number) 
                </div>

                <div className="breakdown">
                (Discounting Level 4) Add all together and divide by 53:<br/>
                ({secondYearTotal} + {thirdYearTotal})/53 = <b>{weightedTotal2}</b> (to the nearest whole number) 
                </div>

                <div className="breakdown">
                According to <b><a href="https://www.gold.ac.uk/media/docs/gam/Progression-and-Award-for-Students-on-Taught-Programmes.pdf" className="link">Progression and Award for
Students on Taught Programmes 9.3.6</a></b> you will automatically be  awarded the higher classification:<br/>
            <b>*{finalGrade} = {classificationFunction(finalGrade)}</b>
                </div>

                </div>
                )

        
        }else{
            breakdown=(<div>
                        <div className="breakdown">
                        Level 4 (first year) = {firstYearWeightsSorted.slice(0,6).join(" + ")} = <b>{firstYearTotal}</b> (or 0)<br/>
                        Level 5 (second year) = {secondYearWeightsSorted.slice(0,6).join(" + ")} = <b>{secondYearTotal/3}</b><br/>
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
                        (Including level 4) Add all together and divide by 59:<br/>
                        ({firstYearTotal} + {secondYearTotal} + {thirdYearTotal})/59 = <b>{weightedTotal1}</b> (to the nearest whole number) 
                        </div>

                        <div className="breakdown">
                        (Discounting Level 4) Add all together and divide by 53:<br/>
                        ({secondYearTotal} + {thirdYearTotal})/53 = <b>{weightedTotal2}</b> (to the nearest whole number) 
                        </div>

                        <div className="breakdown">
                        <b>*{finalGrade} = {classificationFunction(finalGrade)}</b>
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
                    <li>Each of the 8 inputs is worth 15 credits. <br />
                            <b>15 credit module:</b> take 1 slot (e.g if you got 87% , write "87" once)<br/>
                            <b>30 credit module:</b> take 2 slot (e.g if you got 70%, write 70% in two consecutive slots)<br/>
                            <b>60 credit module (your final project):</b> will take 4 slots.</li>
                    <li>A credit in university is an academic unit of measurement of the value of a module. You are awarded the credit once you complete this module (e.g: the marks you achieve for your module's final essay, usually a number around 50-70). </li>
                    <li>Each year of your course contains 120 credits, which can be from eight 15-credit modules or a combination of 30-credit modules.</li>

                    <li>Your final grade will be calculated from the 90 best credit (or no credits) marks from your first year, the 90 best credit marks from your second year, and the 105 best credit marks from your third year. <a className="link" href="https://www.gold.ac.uk/students/assessments/undergraduate-final-result-calculation/">For more information see the official guidance.</a></li>
                    <li>If you do not know the marks for some of your modules, try to make a rough estimate or leave them blank (these will be counted as 0).</li>
                    <li>The calculator follows the grading system for students who completed assessments for level 4 and 5 in 2019/20. According to this grading system, level 4 can be discounted if it gets you the higher classification.</li>
                    <li>The calculator follows the algorithm (see <b><a href="https://www.gold.ac.uk/media/docs/gam/Progression-and-Award-for-Students-on-Taught-Programmes.pdf" className="link">Progression and Award for
Students on Taught Programmes 9.3.6</a></b> for more info) which essentially awards students a higher classification if they are within 2% below the borderline.
between two classes of Honours and who have obtained marks in the higher
classification of modules totalling at least 120 credits in value at Levels 5 and
6, will automatically be awarded the higher classification.</li>
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