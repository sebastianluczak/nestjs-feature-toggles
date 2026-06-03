import { SetMetadata } from "@nestjs/common";

export const FEATURE_TOGGLE_KEY = "featureToggle";

export function FeatureToggle(featureName: string, toggleType: 'release' | 'experiment' | 'ops' = 'ops') {
  return SetMetadata(FEATURE_TOGGLE_KEY, { featureName, toggleType });
}

export const FEATURE_TOGGLE_PROVIDER = 'featureToggleProvider';

export function FeatureToggleProvider() {
  return SetMetadata(FEATURE_TOGGLE_PROVIDER, true);
}