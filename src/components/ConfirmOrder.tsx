import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Order,
  useGlobalState,
} from "@/copilot/poc-chat/states/use-global-state";

interface ConfirmOrderProps {
  status: "complete" | "executing" | "inProgress";
  onConfirm: (order: Order) => void;
  onCancel: () => void;
}

export function ConfirmOrder({ onConfirm, onCancel }: ConfirmOrderProps) {
  const { selectedTshirt, contactInfo, cardInfo } = useGlobalState();

  const handleConfirm = () => {
    if (!selectedTshirt || !contactInfo || !cardInfo) return;

    const order: Order = {
      tshirt: selectedTshirt,
      contactInfo,
      creditCard: cardInfo,
    };

    onConfirm(order);
  };

  if (!selectedTshirt || !contactInfo || !cardInfo) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Missing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            Some required information is missing. Please complete all previous
            steps.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="font-semibold mb-2">T-Shirt Details</h3>
          <p>Name: {selectedTshirt.name}</p>
          <p>Price: ${selectedTshirt.price.toFixed(2)}</p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-semibold mb-2">Contact Information</h3>
          <p>Name: {contactInfo.name}</p>
          <p>Email: {contactInfo.email}</p>
          <p>Phone: {contactInfo.phone}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <p>Card ending in: {cardInfo.number.slice(-4)}</p>
          <p>
            Expires: {cardInfo.exp_month}/{cardInfo.exp_year}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm Order</Button>
      </CardFooter>
    </Card>
  );
}
