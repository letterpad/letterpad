import { getEdgeConfigClient } from "ui";

export const isMembershipFeatureActive = () => {
    return !!getEdgeConfigClient()?.paymentsActive;
}