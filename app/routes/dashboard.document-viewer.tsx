import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DocumentViewer } from "~/components/DocumentViewer";
import { Card } from "~/components/Card";
import { useEffect } from "react";

export const loader = async () => {
  // Sample data for the Iliad books (matching the screenshot)
  const documentSections = [
    {
      id: "book1",
      title: "Book I: The Contention of Achilles and Agamemnon",
      content: `
        <div class="document-content">
          <h3 class="text-xl font-medium mb-4">THE CONTENTION OF ACHILLES AND AGAMEMNON.</h3>
          
          <p>In the war of Troy, the Greeks having sacked some of the neighbouring towns, and taken from thence two beautiful captives, Chryseis and Briseis, allotted the first to Agamemnon, and the last to Achilles. Chryses, the father of Chryseis, and priest of Apollo, comes to the Grecian camp to ransom her; with which the action of the poem opens, in the tenth year of the siege.</p>
          
          <p>The priest being refused, and insolently dismissed by Agamemnon, entreats for vengeance from his god, who inflicts a pestilence on the Greeks. Achilles calls a council, and encourages Calchas to declare the cause of it, who attributes it to the refusal of Chryseis.</p>
          
          <p>The king being obliged to send back his captive, enters into a furious contest with Achilles, which Nestor pacifies; however, as he had the absolute command of the army, he seizes on Briseis in revenge. Achilles in discontent withdraws himself and his forces from the rest of the Greeks...</p>
          
          <p class="mt-8">This is the intro page of the document viewer. Similar to the reference images, it features:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>A sleek top navigation bar with section titles</li>
            <li>An orange dot cursor effect when hovering over the navigation</li>
            <li>Smooth animated transitions between sections</li>
            <li>Elegant typography and spacing for comfortable reading</li>
          </ul>
          
          <p class="mt-4">Try clicking on other sections in the navigation bar above!</p>
        </div>
      `
    },
    {
      id: "book2",
      title: "Book II: The Trial of the Army, and Catalogue of the Forces",
      content: `
        <div class="document-content">
          <h3 class="text-xl font-medium mb-4">THE TRIAL OF THE ARMY, AND CATALOGUE OF THE FORCES</h3>
          
          <p>Jupiter, in pursuance of the request of Thetis, sends a deceitful vision to Agamemnon, persuading him to lead the army to battle in order to make the Greeks sensible of their want of Achilles.</p>
          
          <p>The general, who is deluded with the hopes of taking Troy without his assistance, but fears the army was discouraged by his absence and the late plague, as well as by length of time, contrives to make trial of their disposition by a stratagem.</p>
          
          <p>He first communicates his design to the princes in council that he would propose a return to the soldiers, and that they should put a stop to them if the proposal was embraced. Then he assembles the whole host, and upon moving for a return to Greece, they unanimously agree to it, and run to prepare the ships.</p>
          
          <p>They are detained by the management of Ulysses, who chastises the insolence of Thersites. The assembly is recalled, several speeches made on the occasion, and at length the advice of Nestor followed, which was to make a general muster of the troops, and to divide them into their several nations, before they proceeded to battle.</p>
        </div>
      `
    },
    {
      id: "book3",
      title: "Book III: The Duel of Menelaus and Paris",
      content: `
        <div class="document-content">
          <h3 class="text-xl font-medium mb-4">THE DUEL OF MENELAUS AND PARIS</h3>
          
          <p>The armies being ready to engage, a single combat is agreed upon between Menelaus and Paris (by the intervention of Hector) for the determination of the war.</p>
          
          <p>Iris is sent to call Helen to behold the fight. She leads her to the walls of Troy, where Priam sat with his counsellors, observing the Grecian leaders on the plain below, to whom Helen gives an account of the chief of them.</p>
          
          <p>The kings on either part take the solemn oath for the conditions of the combat. The duel ensues, wherein Paris, being overcome, is snatched away in a cloud by Venus, and transported to his apartment. She then calls Helen from the walls, and brings the lovers together.</p>
          
          <p>Agamemnon, on the part of the Grecians, demands the restoration of Helen, and the performance of the articles.</p>
        </div>
      `
    },
    {
      id: "book4",
      title: "Book IV: The Breach of the Truce, and the First Battle",
      content: `
        <div class="document-content">
          <h3 class="text-xl font-medium mb-4">THE BREACH OF THE TRUCE, AND THE FIRST BATTLE</h3>
          
          <p>The gods deliberate in council concerning the Trojan war: they agree upon the continuation of it, and Jupiter sends down Minerva to break the truce.</p>
          
          <p>She persuades Pandarus to aim an arrow at Menelaus, who is wounded, but cured by Machaon. In the meantime some of the Trojan troops attack the Greeks. Agamemnon is distinguished in all the parts of a good general; he reviews the troops, and exhorts the leaders, some by praises and others by reproofs.</p>
          
          <p>Nestor is particularly celebrated for his military discipline. The battle joins, and great numbers are slain on both sides.</p>
          
          <p>The same day continues through this and the following book, as it does also through the two following, and almost to the end of the seventh book. The scene is wholly in the field before Troy.</p>
        </div>
      `
    },
    {
      id: "book5",
      title: "Book V: The Acts of Diomed",
      content: `
        <div class="document-content">
          <h3 class="text-xl font-medium mb-4">THE ACTS OF DIOMED</h3>
          
          <p>Diomed, assisted by Pallas, performs wonders in this day's battle. Pandarus wounds him with an arrow, but the goddess cures him, enables him to discern gods from mortals, and prohibits him from contending with any of the former, excepting Venus.</p>
          
          <p>Æneas joins Pandarus to oppose him; Pandarus is killed, and Æneas in great danger but for the assistance of Venus; who, as she is removing her son from the fight, is wounded on the hand by Diomed.</p>
          
          <p>Apollo seconds her in his rescue, and at length carries off Æneas to Troy, where he is healed in the temple of Pergamus.</p>
          
          <p>Mars rallies the Trojans, and assists Hector to make a stand. In the meantime Æneas is restored to the field, and they overthrow several of the Greeks; among the rest Tlepolemus is slain by Sarpedon.</p>
          
          <p>Juno and Minerva descend to resist Mars; the latter incites Diomed to go against that god; he wounds him, and sends him groaning to heaven.</p>
        </div>
      `
    }
  ];

  return json({ documentSections });
};

export default function DocumentViewerRoute() {
  const { documentSections } = useLoaderData<typeof loader>();

  // Hide top navbar when document viewer is shown
  useEffect(() => {
    // Find and hide the top navbar
    const topNavbar = document.querySelector('.dashboard-top-navbar');
    if (topNavbar) {
      topNavbar.classList.add('hidden');
    }

    // Cleanup function to restore navbar when leaving this route
    return () => {
      if (topNavbar) {
        topNavbar.classList.remove('hidden');
      }
    };
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden h-full">
      <DocumentViewer 
        title="The Iliad" 
        sections={documentSections}
      />
    </div>
  );
}
