"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    description: string;
    image?: string;
    isPaid: boolean;
    price?: number;
    category: { name: string };
    member: { name: string };
    voteSummary?: {
      upvotes: number;
      downvotes: number;
    };
    _count?: {
      comments: number;
    };
  };
}

const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
      
      {/* IMAGE */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={idea.image || "/placeholder.jpg"}
          alt={idea.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />

        {/* CATEGORY */}
        <Badge className="absolute top-3 left-3 bg-white/90 text-black backdrop-blur">
          {idea.category?.name}
        </Badge>

        {/* PAID / FREE */}
        <Badge
          className={`absolute top-3 right-3 ${
            idea.isPaid ? "bg-yellow-400 text-black" : "bg-green-500"
          }`}
        >
          {idea.isPaid ? `$${idea.price}` : "Free"}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        
        {/* TITLE */}
        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition">
          {idea.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {idea.description}
        </p>

        {/* STATS */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          
          {/* VOTES */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-green-600">
              <ArrowUp size={16} />
              {idea.voteSummary?.upvotes || 0}
            </span>

            <span className="flex items-center gap-1 text-red-500">
              <ArrowDown size={16} />
              {idea.voteSummary?.downvotes || 0}
            </span>

          </div>

          {/* COMMENTS */}
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            {idea._count?.comments || 0}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-2">
          
          {/* AUTHOR */}
          <p className="text-xs text-muted-foreground">
            by {idea.member?.name}
          </p>

          {/* CTA */}
          <Link href={`/ideas/${idea.id}`}>
            <Button size="sm" className="rounded-full px-4">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;