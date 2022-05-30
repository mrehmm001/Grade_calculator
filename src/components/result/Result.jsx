import "./result.scss"
function Result({result, breakdown, classification}) {
    return ( <div className="resultParent">
        <div className="top">
            <div className="subHeading">Results</div>
            <ul>
                <li>Your final grade is a <b>{classification}</b> (with a final weighted average mark of <b>{result}%)</b></li>
            </ul>
        </div>
        <div className="bottom">
        <div className="subHeading">Breakdown</div>
            {breakdown}
        </div>

    </div> );
}

export default Result;