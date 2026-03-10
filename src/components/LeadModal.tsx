import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { COPY } from "@/config/defaults";

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  defaultTeamSize: number;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  teamSize: number;
  consent: boolean;
}

const LeadModal = ({ open, onClose, onSubmit, defaultTeamSize }: LeadModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<LeadFormData>({
    defaultValues: { teamSize: defaultTeamSize, consent: false },
    mode: "onChange",
  });

  const consent = watch("consent");

  const validateEmail = (email: string) => {
    const domain = email.split("@")[1]?.split(".")[0]?.toLowerCase();
    if (domain && COPY.emailBlockList.includes(domain as any)) {
      return "Please use your work email address";
    }
    return true;
  };

  const onFormSubmit = async (data: LeadFormData) => {
    setSubmitting(true);
    // Simulate async
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(data);
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-cb-surface border-cb-border max-w-[480px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cb-text text-xl">See Your Full Cost Breakdown</DialogTitle>
          <DialogDescription className="text-cb-muted text-sm">
            Enter your details to unlock your personalized results and download a PDF report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-cb-text text-sm font-medium">First Name *</Label>
              <Input
                placeholder="Sarah"
                className="bg-cb-surface-2 border-cb-border text-cb-text mt-1"
                {...register("firstName", { required: true })}
              />
            </div>
            <div>
              <Label className="text-cb-text text-sm font-medium">Last Name *</Label>
              <Input
                placeholder="Chen"
                className="bg-cb-surface-2 border-cb-border text-cb-text mt-1"
                {...register("lastName", { required: true })}
              />
            </div>
          </div>

          <div>
            <Label className="text-cb-text text-sm font-medium">Work Email *</Label>
            <Input
              type="email"
              placeholder="sarah@acmecorp.com"
              className="bg-cb-surface-2 border-cb-border text-cb-text mt-1"
              {...register("email", { required: true, validate: validateEmail })}
            />
            {errors.email?.message && (
              <p className="text-cb-red text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label className="text-cb-text text-sm font-medium">Company *</Label>
            <Input
              placeholder="Acme Corp"
              className="bg-cb-surface-2 border-cb-border text-cb-text mt-1"
              {...register("company", { required: true })}
            />
          </div>

          <div>
            <Label className="text-cb-text text-sm font-medium">Job Title *</Label>
            <Input
              placeholder="VP Engineering"
              className="bg-cb-surface-2 border-cb-border text-cb-text mt-1"
              {...register("jobTitle", { required: true })}
            />
          </div>

          <div>
            <Label className="text-cb-text text-sm font-medium">Team Size</Label>
            <Input
              type="number"
              className="bg-cb-surface-2 border-cb-border text-cb-text mt-1"
              {...register("teamSize", { valueAsNumber: true })}
            />
            <p className="text-xs text-cb-muted mt-1">Total developers + QA</p>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(v) => setValue("consent", !!v, { shouldValidate: true })}
              className="mt-0.5 border-cb-purple data-[state=checked]:bg-cb-purple"
            />
            <label htmlFor="consent" className="text-sm text-cb-muted cursor-pointer">
              I agree to CloudBees contacting me about Smart Tests.
            </label>
          </div>

          <button
            type="submit"
            disabled={!isValid || !consent || submitting}
            className="cb-btn-primary w-full text-center flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z" />
                </svg>
                Generating…
              </>
            ) : (
              "Generate My PDF Report →"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal;
