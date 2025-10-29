import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MFASetupProps {
  onComplete?: () => void;
}

export const MFASetup = ({ onComplete }: MFASetupProps) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [factorId, setFactorId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const enrollMFA = async () => {
    setIsEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) throw error;

      if (data) {
        setFactorId(data.id);
        toast.success("MFA enrollment initiated. Please verify with the code sent to your email.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in 2FA");
    } finally {
      setIsEnrolling(false);
    }
  };

  const verifyMFA = async () => {
    if (!verificationCode || !factorId) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (error) throw error;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: data.id,
        code: verificationCode,
      });

      if (verifyError) throw verifyError;

      setIsEnrolled(true);
      toast.success("2FA enabled successfully!");
      onComplete?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to verify code");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isEnrolled) {
    return (
      <Card className="shadow-[var(--shadow-glow)] border-border/50 animate-in zoom-in duration-500">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg animate-in zoom-in duration-700">
            <Check className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">2FA Enabled</CardTitle>
          <CardDescription>Your account is now secured with two-factor authentication</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-[var(--shadow-glow)] border-border/50 hover:shadow-[var(--shadow-hover)] transition-all duration-500 animate-in fade-in slide-in-from-bottom duration-700">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-110 hover:rotate-12 animate-in zoom-in duration-500">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Enable Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!factorId ? (
          <Button 
            onClick={enrollMFA} 
            disabled={isEnrolling} 
            className="w-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-[var(--shadow-glow)]"
          >
            {isEnrolling ? "Setting up..." : "Enable 2FA"}
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            <Button 
              onClick={verifyMFA} 
              disabled={isVerifying} 
              className="w-full hover:scale-105 transition-all duration-300 shadow-md hover:shadow-[var(--shadow-glow)]"
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
