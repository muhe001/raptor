import { Journey } from "../src/results/Journey";
import { loadGTFS } from "../src/gtfs/GTFSLoader";
import { JourneyFactory } from "../src/results/JourneyFactory";
import * as fs from "fs";
import { getArrivalTime, getDepartureTime, RangeQuery } from "../src/query/RangeQuery";
import { RaptorAlgorithmFactory } from "../src/raptor/RaptorAlgorithmFactory";

async function run() {
  console.time("initial load");
  const stream = fs.createReadStream("/home/linus/Downloads/gb-rail-latest.zip");
  const [trips, transfers, interchange, calendars] = await loadGTFS(stream);
  console.timeEnd("initial load");

  console.time("pre-processing");
  const raptor = RaptorAlgorithmFactory.create(
    trips,
    transfers,
    interchange,
    calendars
  );

  const query = new RangeQuery(raptor, new JourneyFactory());

  console.timeEnd("pre-processing");

  console.time("planning");
  const results = query.plan("BMH", "YRK", new Date(), 14 * 60 * 60, 18 * 60 * 60);
  console.timeEnd("planning");

  console.log("Results:");
  results.map(journeyToString).forEach(s => console.log(s));
  console.log(`Memory usage: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB`);
}

function journeyToString(j: Journey) {
  const departure = getDepartureTime(j.legs);
  const arrival = getArrivalTime(j.legs);

  return toTime(departure) + ", " +
    toTime(arrival) + ", " +
    [j.legs[0].origin, ...j.legs.map(l => l.destination)].join("-");
}

function toTime(time: number) {
  let hours: any   = Math.floor(time / 3600);
  let minutes: any = Math.floor((time - (hours * 3600)) / 60);
  let seconds: any = time - (hours * 3600) - (minutes * 60);

  if (hours   < 10) { hours   = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }

  return hours + ":" + minutes + ":" + seconds;
}

run().catch(e => console.error(e));
