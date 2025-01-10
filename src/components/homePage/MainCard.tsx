import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CardHeader } from "./CardHeader";
import { CardContent } from "./CardContent";

export default function MainCard() {
  const [ratingOpen, setRatingOpen] = useState(false);

  return (
    <Card className='overflow-hidden w-[388px] relative'>
      <CardHeader
        onRatingToggle={() => setRatingOpen(!ratingOpen)}
        ratingOpen={ratingOpen}
      />
      <CardContent ratingOpen={ratingOpen} setRatingOpen={setRatingOpen} />
    </Card>
  );
}
