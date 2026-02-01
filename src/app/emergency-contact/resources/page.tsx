'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, ShieldQuestion } from 'lucide-react';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';

const scamResources = [
  {
    title: "Tech Support Scams",
    description: "Scammers pretend to be from a well-known tech company and claim there's a problem with your computer. They'll ask for remote access or payment to 'fix' a non-existent issue. Never give remote access to your computer to someone who calls you out of the blue.",
  },
  {
    title: "Impersonation Scams (e.g., Police, Bank)",
    description: "A scammer calls pretending to be from the police, your bank, or another authority figure. They create a sense of urgency, claiming you owe money or your account is compromised, and pressure you into sending money or sharing sensitive information. Legitimate organizations will never demand immediate payment over the phone with gift cards or wire transfers.",
  },
  {
    title: "Lottery or Prize Scams",
    description: "You receive a call or message saying you've won a large prize, but you must first pay a fee for taxes or processing. If you have to pay money to get a prize, it's a scam. You should never have to pay to receive a legitimate winning.",
  },
  {
    title: "OTP/Verification Code Scams",
    description: "Someone calls or texts asking you to share a One-Time Password (OTP) or verification code that was just sent to your phone. They might claim it's to verify your identity or stop a fraudulent transaction. This code is for you and you alone. Sharing it gives them access to your account.",
  },
  {
    title: "Relationship or 'Grandparent' Scams",
    description: "A scammer builds an online relationship or pretends to be a grandchild in trouble. They'll invent an emergency (like needing bail money or medical fees) and ask you to send money immediately and secretly. Always verify such stories by contacting the person or other family members through known, trusted phone numbers.",
  },
];


export default function ResourcesPage() {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
          Scam Prevention Resources
        </h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="p-6">
        <Card className="animate-in fade-in-0">
          <CardHeader>
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <BookOpen className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>Common Scams Explained</CardTitle>
                    <CardDescription>
                    Knowledge is the best defense. Learn to recognize these common tactics.
                    </CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {scamResources.map((resource, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg">
                    <div className="flex items-center gap-3">
                        <ShieldQuestion className="h-5 w-5 text-primary"/>
                        {resource.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pl-11">
                    {resource.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
