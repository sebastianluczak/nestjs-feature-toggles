import { Injectable } from "@nestjs/common";

@Injectable()
export class FeatureTogglesParser {
  parseFromYaml(yamlString: string): Record<string, boolean> {
    // Simple yaml parsing via regexp:
    const lines = yamlString.split("\n");
    const toggles: Record<string, boolean> = {};
    for (const line of lines) {
      const match = line.match(/^\s*([a-zA-Z0-9_-]+):\s*(true|false)\s*$/);
      if (match) {
        const featureName = match[1];
        if (!featureName || !/^[a-zA-Z0-9_-]+$/.test(featureName)) {
          throw new Error(`Invalid feature name: ${featureName}`);
        }
        const isEnabled = match[2] === "true";
        toggles[featureName] = isEnabled;
      }
    }
    return toggles;
  }
}

// yaml must be like this:
// featureA: true
// featureB: false