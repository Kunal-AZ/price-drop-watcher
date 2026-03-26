import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatPrice = (price) => `₹${new Intl.NumberFormat("en-IN").format(price)}`;

const PriceHistoryModal = ({ open, onClose, product }) => {
  if (!product) return null;

  const data =
    product.price_history?.map((item) => ({
      ...item,
      checked_at: formatDate(item.checked_at),
    })) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl shadow-xl max-w-2xl">

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Price History 📊
          </DialogTitle>
        </DialogHeader>

        {data.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No price history available
          </div>
        ) : (
          <div className="w-full h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="checked_at" />

                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                />

                <Tooltip
                  formatter={(value) => formatPrice(value)}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#eab308"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <Button
          onClick={onClose}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black"
        >
          Close
        </Button>

      </DialogContent>
    </Dialog>
  );
};

export default PriceHistoryModal;