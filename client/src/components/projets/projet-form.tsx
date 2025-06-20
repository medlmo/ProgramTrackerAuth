import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProjet, useUpdateProjet } from "@/hooks/use-projets";
import { insertProjetSchema, ETATS_AVANCEMENT, PROVINCES, type InsertProjet, type Projet, type Programme } from "@shared/schema";
import { Save, X, Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as UILabel } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { communes } from "@/lib/communes";
import { partenaires } from "@/lib/partenaires";
import { cn } from "@/lib/utils";

interface ProjetFormProps {
  projet?: Projet;
  programmes: { id: number; nom: string }[];
  onSubmit: (data: InsertProjet) => void;
  onCancel: () => void;
}

export function ProjetForm({ projet, programmes, onSubmit, onCancel }: ProjetFormProps) {
  const createProjet = useCreateProjet();
  const updateProjet = useUpdateProjet();

  const form = useForm<InsertProjet>({
    resolver: zodResolver(insertProjetSchema),
    defaultValues: {
      nom: projet?.nom || "",
      programmeId: projet?.programmeId || 0,
      objectifs: projet?.objectifs || "",
      partenaires: projet?.partenaires || "",
      montantGlobal: projet?.montantGlobal?.toString() || "0",
      participationRegion: projet?.participationRegion?.toString() || "0",
      maitreOuvrage: projet?.maitreOuvrage || "",
      provinces: projet?.provinces || [],
      communes: projet?.communes || "",
      indicateursQualitatifs: projet?.indicateursQualitatifs || "",
      indicateursQuantitatifs: projet?.indicateursQuantitatifs || "",
      etatAvancement: projet?.etatAvancement || "Planifié",
      remarques: projet?.remarques || "",
      dateDebut: projet?.dateDebut ? (typeof projet.dateDebut === 'string' ? new Date(projet.dateDebut) : projet.dateDebut) : undefined,
      duree: projet?.duree || "",
    },
  });

  const onSubmitForm = async (data: InsertProjet) => {
    try {
      if (projet) {
        await updateProjet.mutateAsync({ id: projet.id, data });
      } else {
        await createProjet.mutateAsync(data);
      }
      onSubmit(data);
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isSubmitting = createProjet.isPending || updateProjet.isPending;

  // Calculate participation percentage
  const montantGlobal = parseFloat(form.watch("montantGlobal") || "0");
  const participationRegion = parseFloat(form.watch("participationRegion") || "0");
  const percentage = montantGlobal > 0 ? ((participationRegion / montantGlobal) * 100).toFixed(1) : "0";

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
      <DialogTitle className="sr-only">
        {projet ? "Modifier le Projet" : "Nouveau Projet"}
      </DialogTitle>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {projet ? "Modifier le Projet" : "Nouveau Projet"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm as any)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le nom du projet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="programmeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programme</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un programme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programmes.map((programme) => (
                        <SelectItem key={programme.id} value={programme.id.toString()}>
                          {programme.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="objectifs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectifs</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les objectifs du projet"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="montantGlobal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant global (DH)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Entrez le montant global"
                      {...field}
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

            <Controller
              control={form.control}
              name="maitreOuvrage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maître d'ouvrage</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={partenaires.map(partenaire => ({ label: partenaire, value: partenaire }))}
                      selected={field.value ? [field.value] : []}
                      onChange={(selected: string[]) => field.onChange(selected[0] || "")}
                      placeholder="Sélectionner le maître d'ouvrage..."
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="provinces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinces</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {PROVINCES.map((province) => (
                      <div key={province} className="flex items-center space-x-2">
                        <Checkbox
                          id={province}
                          checked={field.value?.includes(province)}
                          onCheckedChange={(checked) => {
                            const currentProvinces = field.value || [];
                            if (checked) {
                              field.onChange([...currentProvinces, province]);
                            } else {
                              field.onChange(currentProvinces.filter((p) => p !== province));
                            }
                          }}
                        />
                        <UILabel htmlFor={province}>{province}</UILabel>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <UILabel htmlFor="communes">Communes concernées</UILabel>
              <Controller
                name="communes"
                control={form.control}
                render={({ field }) => (
                  <MultiSelect
                    options={communes.map(commune => ({ label: commune, value: commune }))}
                    selected={field.value ? field.value.split(", ") : []}
                    onChange={(selected: string[]) => field.onChange(selected.join(", "))}
                    placeholder="Sélectionner les communes..."
                    className="w-full"
                  />
                )}
              />
              {form.formState.errors.communes && (
                <p className="text-sm text-red-500">{form.formState.errors.communes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <UILabel htmlFor="partenaires">Partenaires</UILabel>
              <Controller
                name="partenaires"
                control={form.control}
                render={({ field }) => (
                  <MultiSelect
                    options={partenaires.map(partenaire => ({ label: partenaire, value: partenaire }))}
                    selected={field.value ? field.value.split(", ") : []}
                    onChange={(selected: string[]) => field.onChange(selected.join(", "))}
                    placeholder="Sélectionner les partenaires..."
                    className="w-full"
                  />
                )}
              />
              {form.formState.errors.partenaires && (
                <p className="text-sm text-red-500">{form.formState.errors.partenaires.message}</p>
              )}
            </div>

            <Controller
              control={form.control}
              name="indicateursQualitatifs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicateurs qualitatifs</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les indicateurs qualitatifs"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="indicateursQuantitatifs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicateurs quantitatifs</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les indicateurs quantitatifs"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="etatAvancement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>État d'avancement</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'état d'avancement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ETATS_AVANCEMENT.map((etat) => (
                        <SelectItem key={etat} value={etat}>
                          {etat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="remarques"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarques</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ajoutez des remarques"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="dateDebut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={form.control}
              name="duree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez la durée du projet"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="btn-primary">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
