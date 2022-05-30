import "./gradeInput.scss"
function GradeInput({setWeightFunction,year}) {
    return ( 
        <div className="inputParent">
            <div className="inputTitle">{year} year marks</div>
            <div className="inputs">
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,0,e.target.value)} className="input" />
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,1,e.target.value)} className="input" />
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,2,e.target.value)} className="input" />
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,3,e.target.value)} className="input" />
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,4,e.target.value)} className="input" />
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,5,e.target.value)} className="input" />
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,6,e.target.value)} className="input" />
                <input min="0" defaultValue={0} type="number" onInput={(e)=>setWeightFunction(year,7,e.target.value)} className="input" />
            </div>
        </div>
     );
}

export default GradeInput;