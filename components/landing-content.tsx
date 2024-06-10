"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const testimonials = [
  {
    name: "Casey",
    avatar: "C",
    title: "Software Engineer",
    description: "This is the best application I've used!"
  },
  {
    name: "Jordan",
    avatar: "J",
    title: "Product Manager",
    description: "It’s like having an extra team member who’s always available."
  },
  {
    name: "Taylor",
    avatar: "T",
    title: "UX Designer",
    description: "The intuitive design of the AI interface is impressive."
  },
  {
    name: "Morgan",
    avatar: "M",
    title: "Marketing Specialist",
    description: "Our marketing strategies are more effective thanks to the AI insights."
  },
  {
    name: "Riley",
    avatar: "R",
    title: "Business Analyst",
    description: "The analysis and predictions provided are spot-on!"
  },
  {
    name: "Quinn",
    avatar: "Q",
    title: "HR Specialist",
    description: "Great tool for enhancing employee engagement and performance."
  },
  {
    name: "Avery",
    avatar: "A",
    title: "Sales Executive",
    description: "Sales forecasting has never been more accurate."
  },
  {
    name: "Payton",
    avatar: "P",
    title: "Customer Support",
    description: "Our response times have drastically improved using this AI."
  }
];


export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}