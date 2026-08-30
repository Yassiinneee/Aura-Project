import { DELIVERY_OPTIONS } from "../models/index.js";

export function getDeliveryOptions(req, res) {
  return res.json(DELIVERY_OPTIONS);
}
