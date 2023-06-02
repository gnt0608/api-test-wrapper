import * as newman from "newman";
import * as path from "path";
import { APIConnect } from "./APIConnect";
class NewmanConnect extends APIConnect {
  static async connect(config) {
    const connector = new NewmanConnect(config);
    return connector;
  }

  public send_request(request_json, out_path) {
    // call newman.run to pass `options` object and wait for callback
    return new Promise((resolve, reject) => {
      newman.run(
        {
          collection: require(request_json),
          reporters: ["json", "htmlextra"],
          reporter: {
            json: { export: path.resolve(out_path, "api_result.json") },
            htmlextra: { export: path.resolve(out_path, "api_result.html") },
          },
        },
        function (err, summary) {
          if (err) {
            throw err;
          }
          resolve(summary);
        }
      );
    });
  }

  public get_failure_count(summary) {
    return summary.run.failures ? summary.run.failures.length : 0;
  }
}
export { NewmanConnect };
