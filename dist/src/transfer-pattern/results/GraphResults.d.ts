import { ConnectionIndex } from "../../raptor/ScanResults";
import { StopID } from "../../gtfs/GTFS";
import { TransferPatternResults } from "./TransferPatternResults";
/**
 * Uses the Raptor algorithm to perform full day range queries and stores the result as a DAG.
 */
export declare class GraphResults implements TransferPatternResults<TransferPatternGraph> {
    private readonly results;
    /**
     * Generate transfer patterns and store them in a DAG
     */
    add(kConnections: ConnectionIndex): void;
    /**
     * Return the results
     */
    finalize(): TransferPatternGraph;
    private getPaths;
    private getPath;
    /**
     * Merge the given path into the transfer pattern graph.
     */
    private mergePath;
    /**
     * Check whether the given path is the same as the path between the given node and the root node
     */
    private isSame;
}
/**
 * Leaf nodes indexed by their label
 */
export declare type TransferPatternGraph = Record<StopID, TreeNode[]>;
/**
 * Graph node that maintains a reference to it's parent node
 */
export declare type TreeNode = {
    label: StopID;
    parent: TreeNode | null;
};
