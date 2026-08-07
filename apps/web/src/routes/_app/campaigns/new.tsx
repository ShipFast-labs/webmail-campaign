import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { format } from "date-fns";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon, 
  CheckmarkCircle01Icon,
  Tick01Icon,
  Calendar01Icon,
  Mail01Icon
} from "@hugeicons/core-free-icons";

import { useCreateCampaign } from "@/hooks/use-campaigns";
import { useLists } from "@/hooks/use-lists";
import { useTemplates } from "@/hooks/use-templates";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/campaigns/new")({
  component: CampaignBuilderPage,
});

const campaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  subject: z.string().min(1, "Subject is required"),
  fromName: z.string().min(1, "From name is required"),
  fromEmail: z.string().email("Invalid email address"),
  targetListId: z.string().min(1, "Please select an audience list"),
  templateId: z.string().min(1, "Please select a template"),
  isScheduled: z.boolean(),
  scheduledAt: z.date().optional().nullable(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const STEPS = [
  { id: 1, title: "Details" },
  { id: 2, title: "Audience" },
  { id: 3, title: "Template" },
  { id: 4, title: "Schedule" }
];

function CampaignBuilderPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const createCampaign = useCreateCampaign();
  const { data: lists, isLoading: isLoadingLists } = useLists();
  const { data: templates, isLoading: isLoadingTemplates } = useTemplates();

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      subject: "",
      fromName: "",
      fromEmail: "",
      targetListId: "",
      templateId: "",
      isScheduled: false,
      scheduledAt: null,
    },
    mode: "onChange"
  });

  const { watch, setValue, trigger, handleSubmit, formState: { errors } } = form;
  const values = watch();

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(["name", "subject", "fromName", "fromEmail"]);
    } else if (currentStep === 2) {
      isValid = await trigger(["targetListId"]);
    } else if (currentStep === 3) {
      isValid = await trigger(["templateId"]);
    }
    
    if (isValid) {
      setCurrentStep(s => Math.min(s + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: CampaignFormValues) => {
    // Validate final step
    if (data.isScheduled && !data.scheduledAt) {
      form.setError("scheduledAt", { message: "Please select a date" });
      return;
    }
    
    await createCampaign.mutateAsync({
      name: data.name,
      subject: data.subject,
      fromName: data.fromName,
      fromEmail: data.fromEmail,
      targetListId: data.targetListId,
      templateId: data.templateId,
      scheduledAt: data.isScheduled && data.scheduledAt ? data.scheduledAt.toISOString() : null,
    });
    
    navigate({ to: "/campaigns" });
  };

  return (
    <div className="space-y-6 h-full flex flex-col max-w-6xl mx-auto w-full pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="text-muted-foreground h-9 w-9">
            <Link to="/campaigns">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
            <p className="text-muted-foreground mt-1">Configure and send a new email campaign.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-card rounded-xl border shadow-sm">
        {/* Sidebar Progress */}
        <div className="w-48 md:w-64 border-r bg-muted/20 p-6 hidden sm:block shrink-0">
          <div className="space-y-6">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : 
                    isCompleted ? "bg-primary/20 text-primary" : 
                    "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} /> : step.id}
                  </div>
                  <span className={cn(
                    "font-medium text-sm transition-colors",
                    isActive ? "text-foreground" : 
                    isCompleted ? "text-foreground/80" : 
                    "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-1 p-6 md:p-8 max-w-2xl mx-auto w-full">
            <form id="campaign-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* STEP 1: DETAILS */}
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold mb-6">Campaign Details</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Campaign Name</Label>
                      <Input 
                        id="name" 
                        placeholder="e.g. Summer Sale 2026" 
                        {...form.register("name")}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input 
                        id="subject" 
                        placeholder="e.g. Don't miss out on these deals!" 
                        {...form.register("subject")}
                      />
                      {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromName">From Name</Label>
                        <Input 
                          id="fromName" 
                          placeholder="e.g. Acme Corp" 
                          {...form.register("fromName")}
                        />
                        {errors.fromName && <p className="text-xs text-destructive">{errors.fromName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromEmail">From Email</Label>
                        <Input 
                          id="fromEmail" 
                          placeholder="hello@acmecorp.com" 
                          {...form.register("fromEmail")}
                        />
                        {errors.fromEmail && <p className="text-xs text-destructive">{errors.fromEmail.message}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: AUDIENCE */}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold mb-2">Select Audience</h2>
                  <p className="text-muted-foreground mb-6">Choose which list will receive this campaign.</p>

                  <div className="space-y-3">
                    {isLoadingLists ? (
                      <p className="text-sm text-muted-foreground">Loading lists...</p>
                    ) : lists?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No lists found. Please create one first.</p>
                    ) : (
                      lists?.map(list => (
                        <motion.button
                          type="button"
                          key={list.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setValue("targetListId", list.id, { shouldValidate: true })}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            values.targetListId === list.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                          )}
                        >
                          <div>
                            <p className="font-semibold">{list.name}</p>
                            <p className="text-sm text-muted-foreground">{list.contactCount} contacts</p>
                          </div>
                          {values.targetListId === list.id && (
                            <HugeiconsIcon icon={Tick01Icon} size={20} className="text-primary" />
                          )}
                        </motion.button>
                      ))
                    )}
                    {errors.targetListId && <p className="text-xs text-destructive">{errors.targetListId.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: TEMPLATE */}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold mb-2">Select Template</h2>
                  <p className="text-muted-foreground mb-6">Choose the email design for this campaign.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {isLoadingTemplates ? (
                      <p className="text-sm text-muted-foreground col-span-2">Loading templates...</p>
                    ) : templates?.length === 0 ? (
                      <p className="text-sm text-muted-foreground col-span-2">No templates found. Please create one first.</p>
                    ) : (
                      templates?.map(tpl => (
                        <motion.button
                          type="button"
                          key={tpl.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setValue("templateId", tpl.id, { shouldValidate: true })}
                          className={cn(
                            "flex flex-col p-4 rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            values.templateId === tpl.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/50"
                          )}
                        >
                          <p className="font-semibold mb-1">{tpl.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{tpl.subject}</p>
                          {values.templateId === tpl.id && (
                            <div className="mt-3 flex items-center text-xs font-medium text-primary">
                              <HugeiconsIcon icon={Tick01Icon} size={14} className="mr-1" /> Selected
                            </div>
                          )}
                        </motion.button>
                      ))
                    )}
                  </div>
                  {errors.templateId && <p className="text-xs text-destructive mt-3">{errors.templateId.message}</p>}
                </motion.div>
              )}

              {/* STEP 4: SCHEDULE */}
              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold mb-6">Schedule & Review</h2>
                  
                  <div className="space-y-6">
                    {/* Delivery Options */}
                    <div className="p-1 bg-muted/50 rounded-lg inline-flex w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => { setValue("isScheduled", false); setValue("scheduledAt", null); }}
                        className={cn(
                          "flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          !values.isScheduled ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Send Immediately
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue("isScheduled", true)}
                        className={cn(
                          "flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          values.isScheduled ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Schedule for Later
                      </button>
                    </div>

                    {values.isScheduled && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2 p-4 border rounded-lg bg-card"
                      >
                        <Label>Select Date & Time</Label>
                        <div className="flex gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] justify-start text-left font-normal focus-visible:ring-2",
                                  !values.scheduledAt && "text-muted-foreground"
                                )}
                              >
                                <HugeiconsIcon icon={Calendar01Icon} size={16} className="mr-2" />
                                {values.scheduledAt ? format(values.scheduledAt, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={values.scheduledAt || undefined}
                                onSelect={(date) => setValue("scheduledAt", date, { shouldValidate: true })}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        {errors.scheduledAt && <p className="text-xs text-destructive">{errors.scheduledAt.message}</p>}
                      </motion.div>
                    )}

                    {/* Summary box */}
                    <div className="bg-muted/30 p-5 rounded-lg border">
                      <h3 className="font-semibold mb-4 border-b pb-2">Campaign Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-[100px_1fr]">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{values.name}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <span className="text-muted-foreground">Subject:</span>
                          <span className="font-medium">{values.subject}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <span className="text-muted-foreground">Audience:</span>
                          <span className="font-medium">
                            {lists?.find(l => l.id === values.targetListId)?.name || "—"}
                          </span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <span className="text-muted-foreground">Template:</span>
                          <span className="font-medium">
                            {templates?.find(t => t.id === values.templateId)?.name || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 md:p-6 border-t bg-card shrink-0 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext}>
                Next Step
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                form="campaign-form"
                disabled={createCampaign.isPending}
                className={cn(values.isScheduled ? "bg-blue-600 hover:bg-blue-700" : "")}
              >
                {createCampaign.isPending ? (
                  "Processing..."
                ) : values.isScheduled ? (
                  <>
                    <HugeiconsIcon icon={Calendar01Icon} size={16} className="mr-2" />
                    Schedule Campaign
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Mail01Icon} size={16} className="mr-2" />
                    Send Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
