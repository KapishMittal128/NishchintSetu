'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, ShieldQuestion } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';

export default function ResourcesPage() {
  const { t } = useTranslation();

  const scamResources = [
    {
      key: 'techSupport',
      title: t('ecResources.scams.techSupport.title'),
      description: t('ecResources.scams.techSupport.description'),
    },
    {
      key: 'impersonation',
      title: t('ecResources.scams.impersonation.title'),
      description: t('ecResources.scams.impersonation.description'),
    },
    {
      key: 'lottery',
      title: t('ecResources.scams.lottery.title'),
      description: t('ecResources.scams.lottery.description'),
    },
    {
      key: 'otp',
      title: t('ecResources.scams.otp.title'),
      description: t('ecResources.scams.otp.description'),
    },
    {
      key: 'relationship',
      title: t('ecResources.scams.relationship.title'),
      description: t('ecResources.scams.relationship.description'),
    },
  ];

  return (
    <Card className="animate-in fade-in-0">
      <CardHeader>
        <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <BookOpen className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>{t('ecResources.cardTitle')}</CardTitle>
                <CardDescription>
                {t('ecResources.cardDescription')}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {scamResources.map((resource, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg text-left">
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
  );
}
