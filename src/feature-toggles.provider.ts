import { Injectable } from "@nestjs/common";
import { FeatureTogglesParser } from "./feature-toggles.parser";

@Injectable()
export class FeatureTogglesProvider {
  private readonly releaseToggles: Record<string, boolean> = {};
  private readonly experimentToggles: Record<string, boolean> = {};
  private readonly opsToggles: Record<string, boolean> = {};

  constructor(private readonly parser: FeatureTogglesParser) {
    // Initialize toggles if needed, e.g., from a config file or environment variables
  }

  // Methods to set toggles
  setReleaseToggle(featureName: string, isEnabled: boolean) {
    this.releaseToggles[featureName] = isEnabled;
  }

  setExperimentToggle(featureName: string, isEnabled: boolean) {
    this.experimentToggles[featureName] = isEnabled;
  }

  setOpsToggle(featureName: string, isEnabled: boolean) {
    this.opsToggles[featureName] = isEnabled;
  }

  // Methods to get toggles
  getReleaseToggle(featureName: string): boolean {
    return this.releaseToggles[featureName] ?? false;
  }

  getExperimentToggle(featureName: string): boolean {
    return this.experimentToggles[featureName] ?? false;
  }

  getOpsToggle(featureName: string): boolean {
    return this.opsToggles[featureName] ?? false;
  }

  refreshToggles() {
    // Implement logic to refresh toggles, e.g., from a config file or external service
  }
}