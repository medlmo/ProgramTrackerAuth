import { saveAs } from "file-saver";
import {
  Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, BorderStyle, ImageRun
} from "docx";
import type { Projet } from "@shared/schema";

export async function exportProjetToWord(projet: Projet, programmeName: string) {
  // Tableau des infos projet (intitulés actuels)
  const rows = [
    ["Nom du projet", projet.nom],
    ["Programme", programmeName],
    ["Maître d'ouvrage", projet.maitreOuvrage || "Non défini"],
    ["Montant global", projet.montantGlobal?.toString() || "Non défini"],
    ["Contribution région", projet.participationRegion?.toString() || "Non définie"],
    ["État d'avancement", projet.etatAvancement],
    ["Objectifs", projet.objectifs || "Non définis"],
    ["Partenaires", projet.partenaires || "Non définis"],
    ["Provinces", (projet.provinces || []).join(", ") || "Non définies"],
    ["Communes", projet.communes || "Non définies"],
    ["Indicateurs qualitatifs", projet.indicateursQualitatifs || "Non définis"],
    ["Indicateurs quantitatifs", projet.indicateursQuantitatifs || "Non définis"],
    ["Remarques", projet.remarques || ""]
  ];

  // Construction du tableau avec bordures
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: label, bold: true, size: 24 })],
              }),
            ],
          }),
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: value, size: 24 })],
              }),
            ],
          }),
        ],
      })
    ),
  });

  // Construction du document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Titre principal centré
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Fiche projet", bold: true, size: 32 }),
            ],
            spacing: { after: 400 },
          }),
          // Tableau projet
          table,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Fiche_Projet_${projet.nom}.docx`);
} 