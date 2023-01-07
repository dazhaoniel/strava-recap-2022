import "./App.css";
import LineChart from "./Charts/LineChart";
import Histogram from "./Charts/Histogram";
import TimeSeries from "./Charts/TimeSeries";
import data from "../..export_11620080/activities.csv";

function App() {
  return (
    <div className="row">
      <LineChart height={400} width={400} />
    </div>
  );
}

export default App;
