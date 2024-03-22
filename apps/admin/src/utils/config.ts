'use-client'

import { getEdgeConfigClient } from "../shared/utils"

export const isMembershipFeatureActive = () => {
    return getEdgeConfigClient()?.paymentsActive
}