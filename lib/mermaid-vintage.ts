const SVG_NS = "http://www.w3.org/2000/svg";

export const PLATE = {
  paper: "#f3ecdd",
  raised: "#faf5e9",
  ink: "#2b2318",
  muted: "#6e604c",
  rule: "#d9cdb4",
} as const;

const GARAMOND =
  'var(--font-eb-garamond), "EB Garamond", "Times New Roman", serif';

export const mermaidVintageConfig = {
  startOnLoad: false,
  theme: "base" as const,
  securityLevel: "loose" as const,
  fontFamily: GARAMOND,
  fontSize: 16,
  flowchart: {
    htmlLabels: true,
    curve: "linear" as const,
    padding: 10,
    nodeSpacing: 34,
    rankSpacing: 46,
    diagramPadding: 8,
    wrappingWidth: 148,
  },
  themeVariables: {
    darkMode: false,
    background: PLATE.paper,
    primaryColor: PLATE.raised,
    primaryTextColor: PLATE.ink,
    primaryBorderColor: PLATE.ink,
    secondaryColor: PLATE.paper,
    secondaryTextColor: PLATE.ink,
    secondaryBorderColor: PLATE.ink,
    tertiaryColor: PLATE.paper,
    tertiaryTextColor: PLATE.ink,
    tertiaryBorderColor: PLATE.muted,
    lineColor: PLATE.ink,
    textColor: PLATE.ink,
    mainBkg: PLATE.raised,
    nodeBkg: PLATE.raised,
    nodeBorder: PLATE.ink,
    clusterBkg: PLATE.paper,
    clusterBorder: PLATE.ink,
    titleColor: PLATE.ink,
    edgeLabelBackground: PLATE.paper,
    nodeTextColor: PLATE.ink,
    defaultLinkColor: PLATE.ink,
    arrowheadColor: PLATE.ink,
    actorBkg: PLATE.raised,
    actorBorder: PLATE.ink,
    actorTextColor: PLATE.ink,
    actorLineColor: PLATE.ink,
    signalColor: PLATE.ink,
    signalTextColor: PLATE.ink,
    labelBoxBkgColor: PLATE.paper,
    labelBoxBorderColor: PLATE.ink,
    labelTextColor: PLATE.ink,
    loopTextColor: PLATE.ink,
    noteBkgColor: PLATE.raised,
    noteTextColor: PLATE.ink,
    noteBorderColor: PLATE.ink,
    activationBkgColor: PLATE.raised,
    activationBorderColor: PLATE.ink,
  },
};

export function parseMermaidSvg(markup: string): SVGSVGElement | null {
  const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
  if (!parsed.querySelector("parsererror")) {
    const root = parsed.documentElement;
    if (root?.tagName.toLowerCase() === "svg") {
      return document.importNode(root, true) as unknown as SVGSVGElement;
    }
  }
  const shell = document.createElement("div");
  shell.innerHTML = markup;
  return shell.querySelector("svg");
}

function ensureHatch(svg: SVGSVGElement, patternId: string) {
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  const pattern = document.createElementNS(SVG_NS, "pattern");
  pattern.setAttribute("id", patternId);
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("width", "6");
  pattern.setAttribute("height", "6");
  pattern.setAttribute("patternTransform", "rotate(45)");

  const bg = document.createElementNS(SVG_NS, "rect");
  bg.setAttribute("width", "6");
  bg.setAttribute("height", "6");
  bg.setAttribute("fill", PLATE.raised);

  const line = document.createElementNS(SVG_NS, "line");
  line.setAttribute("x1", "0");
  line.setAttribute("y1", "0");
  line.setAttribute("x2", "0");
  line.setAttribute("y2", "6");
  line.setAttribute("stroke", PLATE.ink);
  line.setAttribute("stroke-width", "0.55");
  line.setAttribute("opacity", "0.38");

  pattern.append(bg, line);
  defs.appendChild(pattern);
}

export function engraveMermaidSvg(svg: SVGSVGElement, diagramId: string) {
  const hatchId = `${diagramId}-hatch`;
  ensureHatch(svg, hatchId);

  svg.style.background = "transparent";
  svg.querySelectorAll("[filter]").forEach((el) => el.removeAttribute("filter"));

  svg.querySelectorAll("rect").forEach((el) => {
    el.setAttribute("rx", "0");
    el.setAttribute("ry", "0");
  });

  const style = document.createElementNS(SVG_NS, "style");
  style.textContent = `
    .node .label-container,
    .node rect.basic,
    .node polygon,
    .node circle,
    .node ellipse {
      fill: url(#${hatchId}) !important;
      stroke: ${PLATE.ink} !important;
      stroke-width: 1.2px !important;
    }
    .node .label rect,
    .label rect {
      fill: none !important;
      stroke: none !important;
    }
    .cluster rect {
      fill: ${PLATE.paper} !important;
      stroke: ${PLATE.ink} !important;
      stroke-width: 1px !important;
    }
    .edgePath .path,
    .flowchart-link,
    path.flowchart-link {
      stroke: ${PLATE.ink} !important;
      stroke-width: 1.1px !important;
      fill: none !important;
    }
    .arrowheadPath,
    marker path {
      fill: ${PLATE.ink} !important;
      stroke: ${PLATE.ink} !important;
    }
    .edgeLabel rect,
    .labelBkg {
      fill: ${PLATE.paper} !important;
      stroke: none !important;
    }
    .nodeLabel, .edgeLabel, .label, text {
      font-family: ${GARAMOND} !important;
      fill: ${PLATE.ink};
      color: ${PLATE.ink} !important;
    }
  `;
  svg.appendChild(style);
}
