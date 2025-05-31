import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const data = {
    name: "A",
    children: [
        { name: "B", children: [{ name: "1" }, { name: "2" }, { name: "3" }] },
        { name: "C", children: [{ name: "4" }, { name: "5" }, { name: "6" }] },
        { name: "D", children: [{ name: "7" }, { name: "8" }, { name: "9" }] },
        { name: "E", children: [{ name: "10" }, { name: "11" }, { name: "12" }] },
        { name: "F", children: [{ name: "13" }, { name: "14" }, { name: "15" }] },
        { name: "G", children: [{ name: "16" }, { name: "17" }, { name: "18" }] },
    ],
};

interface TreeNode extends d3.HierarchyPointNode<any> {
    id?: string;
    _children?: TreeNode[];
    x0?: number;
    y0?: number;
}

interface CollapseNode {
    children?: CollapseNode[];
    _children?: CollapseNode[];
}

function collapse(d: CollapseNode): void {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = undefined;
    }
}

export default function DataVisualizer() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const gRef = useRef<SVGGElement | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);
    const [rootData, setRootData] = useState<TreeNode | undefined>();

    useEffect(() => {
        const root = d3.hierarchy(data) as any as TreeNode;
        root.x0 = 0;
        root.y0 = 0;
        if (root.children) {
            root.children.forEach(collapse);
        }
        setRootData(root);
    }, []);

    useEffect(() => {
        if (!rootData) return;

        const svg = d3.select(svgRef.current);
        const g = d3.select(gRef.current);
        const width = window.innerWidth;
        const height = window.innerHeight;

        svg.attr("width", width).attr("height", height);

        const treeLayout = d3.tree().nodeSize([60, 200]);

        let i = 0;
        const duration = 300;

        interface TreeNode extends d3.HierarchyPointNode<any> {
            id?: string;
            _children?: TreeNode[];
            x0?: number;
            y0?: number;
        }

        interface TreeLink {
            source: TreeNode;
            target: TreeNode;
        }

        function update(source: TreeNode) {
            const treeData = treeLayout(rootData as TreeNode);
            const nodes: TreeNode[] = treeData.descendants() as TreeNode[];
            const links: TreeLink[] = treeData.links() as TreeLink[];

            const node = g
                .selectAll<SVGGElement, TreeNode>("g.node")
                .data(nodes, (d: TreeNode) => d.id || (d.id = (++i).toString()));

            const nodeEnter = node
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", () => `translate(${source.y0},${source.x0})`)
                .on("click", (event: any, d: TreeNode) => {
                    event.stopPropagation();
                    if (d.children) {
                        d._children = d.children;
                        d.children = undefined;
                    } else {
                        d.children = d._children;
                        d._children = undefined;
                    }
                    update(d);
                    centerNode(d);
                });

            nodeEnter
                .append("rect")
                .attr("x", -40)
                .attr("y", -15)
                .attr("width", 80)
                .attr("height", 30)
                .attr("rx", 6)
                .attr("fill", "#000")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5);

            nodeEnter
                .append("text")
                .attr("class", "label")
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .attr("fill", "#fff")
                .text((d: TreeNode) => d.data.name);

            nodeEnter
                .filter((d: TreeNode) => !!d.children || !!d._children)
                .append("text")
                .attr("class", "arrow")
                .attr("x", 45)
                .attr("dy", "0.35em")
                .attr("text-anchor", "start")
                .style("font-size", "14px")
                .text((d: TreeNode) => (d._children ? "➤" : "◀"));

            const nodeUpdate = nodeEnter.merge(node);

            nodeUpdate
                .transition()
                .duration(duration)
                .attr("transform", (d: TreeNode) => `translate(${d.y},${d.x})`);

            nodeUpdate.select<SVGTextElement>("text.arrow").text((d: TreeNode) => (d._children ? "➤" : "◀"));

            const nodeExit = node
                .exit()
                .transition()
                .duration(duration)
                .attr("transform", () => `translate(${source.y},${source.x})`)
                .remove();

            const link = g.selectAll<SVGPathElement, TreeLink>("path.link").data(links, (d: TreeLink) => d.target.id ?? `${d.source.id ?? "s"}-${d.target.data.name}`);

            const linkEnter = link
                .enter()
                .insert("path", "g")
                .attr("class", "link")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5)
                .attr("d", () => {
                    const o = { x: source.x0 ?? 0, y: (source.y0 ?? 0) + 50 };
                    return diagonal(o, o);
                });

            const linkUpdate = linkEnter.merge(link);
            linkUpdate
                .transition()
                .duration(duration)
                .attr("d", (d: TreeLink) => {
                    const sourcePos = { x: d.source.x, y: d.source.y + 50 };
                    const targetPos = { x: d.target.x, y: d.target.y };
                    return diagonal(sourcePos, targetPos);
                });

            link
                .exit()
                .transition()
                .duration(duration)
                .attr("d", () => {
                    const o = { x: source.x, y: source.y + 0 };
                    return diagonal(o, o);
                })
                .remove();

            nodes.forEach((d: TreeNode) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        interface Point {
            x: number;
            y: number;
        }

        function diagonal(s: Point, d: Point): string {
            return `M${s.y},${s.x} C${(s.y + d.y) / 2},${s.x} ${(s.y + d.y) / 2},${d.x
                } ${d.y},${d.x}`;
        }

        function centerNode(source: TreeNode) {
            const svgNode = svg.node();
            if (!svgNode) return;
            const t = d3.zoomTransform(svgNode);
            const scale = t.k;
            const x = -source.y * scale + width / 2;
            const y = -source.x * scale + height / 2;

            svg
                .transition()
                .duration(500)
                .call(
                    d3.zoom().transform as any,
                    d3.zoomIdentity.translate(x, y).scale(scale)
                );
        }

        zoomRef.current = d3
            .zoom()
            .scaleExtent([0.1, 2])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
        // @ts-expect-error
        svg.call(zoomRef.current);

        const initialX = width / 2 - 100;
        const initialY = height / 2;
        const initialTransform = d3.zoomIdentity
            .translate(initialX, initialY)
            .scale(1);
        // @ts-expect-error
        svg.call(zoomRef.current.transform, initialTransform);
        update(rootData);
    }, [rootData]);

    return (
        <div style={{ backgroundColor: "#ddd", height: "100%", width: "99%" }}>
            <svg
                ref={svgRef}
                style={{
                    width: "100%",
                    height: "100%",
                    userSelect: "none",
                    touchAction: "none",
                    overflow: "visible",
                }}
            >
                <g ref={gRef} />
            </svg>
        </div>
    );
}
