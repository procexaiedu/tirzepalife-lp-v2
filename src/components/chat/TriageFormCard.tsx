"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ChatUiFormCard, TriageFormValues } from "@/types/chatUi";

interface Props {
  schema: ChatUiFormCard;
  isSubmitting?: boolean;
  onSubmit: (values: TriageFormValues) => void | Promise<void>;
}

export const TriageFormCard = ({ schema, isSubmitting, onSubmit }: Props) => {
  const initialValues = useMemo<TriageFormValues>(() => {
    const out: TriageFormValues = {};
    for (const f of schema.fields) out[f.name] = "";
    return out;
  }, [schema.fields]);

  const [values, setValues] = useState<TriageFormValues>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const missingRequired = useMemo(() => {
    const missing: string[] = [];
    for (const f of schema.fields) {
      if (f.required && !values[f.name]) missing.push(f.name);
    }
    return missing;
  }, [schema.fields, values]);

  const handleSubmit = async () => {
    const nextTouched: Record<string, boolean> = { ...touched };
    for (const f of schema.fields) nextTouched[f.name] = true;
    setTouched(nextTouched);

    if (missingRequired.length > 0) return;
    await onSubmit(values);
  };

  return (
    <div className="w-full max-w-[90%] sm:max-w-[85%]">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <div className="mb-4">
          <h4 className="font-serif text-lg text-[var(--color-medical-navy)]">{schema.title}</h4>
          {schema.description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{schema.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {schema.fields.map((field) => {
            const isMissing = field.required && touched[field.name] && !values[field.name];
            return (
              <div key={field.name} className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <label className="text-sm font-medium text-gray-700 leading-snug">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                </div>

                {field.helperText && (
                  <p className="text-[11px] text-gray-500">{field.helperText}</p>
                )}

                <div className="grid grid-cols-1 gap-2">
                  {field.options.map((opt) => {
                    const checked = values[field.name] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer transition-colors",
                          checked ? "border-[var(--color-medical-navy)] bg-[var(--color-medical-navy)]/5" : "border-gray-200 hover:bg-gray-50",
                          isSubmitting ? "opacity-60 pointer-events-none" : ""
                        )}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={opt.value}
                          checked={checked}
                          onChange={() => {
                            setValues((prev) => ({ ...prev, [field.name]: opt.value }));
                            setTouched((prev) => ({ ...prev, [field.name]: true }));
                          }}
                          className="w-4 h-4 text-[var(--color-medical-navy)]"
                        />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>

                {isMissing && (
                  <p className="text-xs text-red-600">Selecione uma opção para continuar.</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-xl">
            {isSubmitting ? "Enviando..." : (schema.submitLabel ?? "Continuar")}
          </Button>
        </div>
      </div>
    </div>
  );
};


