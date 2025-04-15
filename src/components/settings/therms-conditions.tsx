"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, FileText, Info } from "lucide-react"
import { useState } from "react"

export default function ThermsConditions() {
  const [accepted, setAccepted] = useState(false)
  const effectiveDate = "April 15, 2025"

  return (
    <div className="container relative mx-auto w-[60vw] overflow-hidden pb-8">
      <div className="absolute hidden md:block -right-10 -top-20 h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10"></div>

      <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
        <CardHeader className="px-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-center font-instrument text-4xl font-normal">
            NerdSpace - Terms and Conditions
          </CardTitle>
          <CardDescription className="mt-2 text-center">
            Effective Date: {effectiveDate}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="font-geist text-muted-foreground">
              Welcome to NerdSpace — a platform for passionate builders, creators, and nerds of all kinds to connect, 
              collaborate, and share their projects with the world.
            </p>
            
            <p className="mb-6 font-geist text-muted-foreground">
              By accessing or using NerdSpace, you agree to be bound by these Terms and Conditions ("Terms"). 
              If you do not agree, please do not use the platform.
            </p>

            <TermsSection 
              number="1" 
              title="Eligibility"
              content="You must be at least 13 years old to use NerdSpace. By using the platform, you represent that you meet this age requirement and have the legal capacity to agree to these Terms."
            />

            <TermsSection 
              number="2" 
              title="User Accounts"
              content={[
                "You are responsible for maintaining the confidentiality of your login credentials.",
                "You agree not to impersonate others or create accounts using false information.",
                "You may not use NerdSpace for any unlawful or abusive purposes."
              ]}
            />

            <TermsSection 
              number="3" 
              title="Content Ownership & Usage"
              content={[
                "You retain ownership of any content you upload to NerdSpace (projects, posts, comments, etc).",
                "By posting content, you grant NerdSpace a non-exclusive, worldwide, royalty-free license to use, display, and share your content within the platform to help promote the community.",
                "You are responsible for ensuring your content does not violate any copyright or intellectual property laws."
              ]}
            />

            <TermsSection 
              number="4" 
              title="Prohibited Conduct"
              content={[
                "Use the platform to harass, bully, or threaten others.",
                "Upload or distribute any malicious software or spam.",
                "Violate any applicable local, state, national, or international laws."
              ]}
              prefix="You agree not to:"
            />

            <TermsSection 
              number="5" 
              title="Community Guidelines"
              content="NerdSpace is built around collaboration and mutual respect. We encourage healthy discussion and constructive feedback. We reserve the right to remove any content or suspend accounts that violate the spirit of the community."
            />

            <TermsSection 
              number="6" 
              title="Termination"
              content="We may suspend or terminate your access to NerdSpace at any time, without notice, if you violate these Terms or harm the community."
            />

            <TermsSection 
              number="7" 
              title="Disclaimer"
              content="NerdSpace is provided as is without warranties of any kind. We are not liable for any content posted by users or any damages resulting from your use of the platform."
            />

            <TermsSection 
              number="8" 
              title="Changes to Terms"
              content="We may update these Terms from time to time. We will notify users of significant changes. Continued use of NerdSpace after such changes constitutes acceptance."
            />

            <TermsSection 
              number="9" 
              title="Contact"
              content="If you have questions about these Terms, reach out to us at: support@nerdspace.com"
              isLast={true}
            />
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="mb-6 flex w-full items-start gap-3 rounded-lg bg-primary/5 p-4">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">
                By clicking "I Accept", you acknowledge that you have read and agree to be bound by these Terms and Conditions.
              </p>
            </div>
            
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:w-auto">
              <Button 
                variant="outline" 
                className="sm:w-32"
                onClick={() => window.history.back()}
              >
                Decline
              </Button>
              <Button 
                className="sm:w-32 gap-2"
                onClick={() => setAccepted(true)}
                disabled={accepted}
              >
                {accepted ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Accepted
                  </>
                ) : (
                  "I Accept"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface TermsSectionProps {
  number: string
  title: string
  content: string | string[]
  prefix?: string
  isLast?: boolean
}

function TermsSection({ number, title, content, prefix, isLast = false }: TermsSectionProps) {
  return (
    <div className={`${!isLast ? "mb-6" : ""}`}>
      <h2 className="text-lg mb-2 flex items-center gap-2 font-geist">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {number}
        </span>
        {title}
      </h2>

      {prefix && <p className="mb-2">{prefix}</p>}

      {typeof content === "string" ? (
        <p className="text-muted-foreground font-geist">{content}</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1 font-geist">
          {content.map((item, index) => (
            <li key={index} className="text-muted-foreground font-geist">
              {item}
            </li>
          ))}
        </ul>
      )}

      {!isLast && <Separator className="mt-6" />}
    </div>
  )
}
