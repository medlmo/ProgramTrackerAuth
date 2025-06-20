
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProgramme, useUpdateProgramme } from "@/hooks/use-programmes";
import { insertProgrammeSchema, SECTEURS, type InsertProgramme, type Programme } from "@shared/schema";
import { Save, X } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { partenaires } from "@/lib/partenaires";

interface ProgrammeFormProps {
  programme?: Programme | null;
  onClose: () => void;
}

export default function ProgrammeForm({ programme, onClose }: ProgrammeFormProps) {
  const createProgramme = useCreateProgramme();
  const updateProgramme = useUpdateProgramme();

  const form = useForm<InsertProgramme>({
    resolver: zodResolver(insertProgrammeSchema),
    defaultValues: {
      nom: programme?.nom || "",
      secteur: programme?.secteur || "",
      objectifGlobal: programme?.objectifGlobal || "",
      partenaires: programme?.partenaires || "",
      montantGlobal: programme?.montantGlobal || "",
      participationRegion: programme?.participationRegion || "",
      dateDebut: programme?.dateDebut || undefined,
      duree: programme?.duree || "",
    },
  });

  const onSubmit = async (data: InsertProgramme) => {
    try {
      if (programme) {
        await updateProgramme.mutateAsync({ id: programme.id, data });
      } else {
        await createProgramme.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isSubmitting = createProgramme.isPending || updateProgramme.isPending;

  // Calculate participation percentage
  const montantGlobal = parseFloat(form.watch("montantGlobal") || "0");
  const participationRegion = parseFloat(form.watch("participationRegion") || "0");
  const percentage = montantGlobal > 0 ? ((participationRegion / montantGlobal) * 100).toFixed(1) : "0";

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          {programme ? "Modifier le Programme" : "Nouveau Programme"}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nom du Programme <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du programme..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="secteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Secteur <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un secteur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SECTEURS.map((secteur) => (
                        <SelectItem key={secteur} value={secteur}>
                          {secteur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="montantGlobal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant Global (MAD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="participationRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contribution de la Région (MAD)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          const montantGlobal = form.getValues("montantGlobal");
                          if (value && montantGlobal) {
                            const participation = parseFloat(value);
                            const montant = parseFloat(montantGlobal);
                            if (participation > montant) {
                              form.setError("participationRegion", {
                                type: "manual",
                                message: "La contribution de la région ne peut pas dépasser le montant total"
                              });
                            } else {
                              form.clearErrors("participationRegion");
                            }
                          }
                        }}
                      />
                    </FormControl>
                    {montantGlobal > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Contribution: {percentage}% du montant global
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateDebut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Début</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? (typeof field.value === 'string' ? field.value : new Date(field.value).toISOString().split('T')[0]) : ''}
                      onChange={(e) => field.onChange(e.target.value || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 2 ans, 18 mois..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="objectifGlobal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectif Global</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Décrivez l'objectif global du programme..."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="partenaires"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partenaires</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={partenaires.map(partenaire => ({ label: partenaire, value: partenaire }))}
                        selected={field.value ? field.value.split(", ") : []}
                        onChange={(selected: string[]) => field.onChange(selected.join(", "))}
                        placeholder="Sélectionner les partenaires..."
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-primary">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
