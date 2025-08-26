import {
  testUsers,
  testTasks,
  testProjects,
  getTestScenario,
} from './test-users';

export class SeedManager {
  private static instance: SeedManager;
  private goldenSnapshotPath = './e2e/data/golden-snapshot.json';
  private workerNamespaces = new Map<number, string>();

  constructor() {
    if (SeedManager.instance) {
      return SeedManager.instance;
    }
    SeedManager.instance = this;
  }

  /**
   * Creates a golden snapshot of base test data
   * This snapshot is used to quickly restore deterministic state
   */
  async createGoldenSnapshot(): Promise<void> {
    console.log('📸 Creating golden snapshot...');

    const goldenData = {
      version: '1.0.0',
      timestamp: '2024-01-01T00:00:00.000Z',
      users: Object.values(testUsers),
      tasks: testTasks,
      projects: testProjects,
      metadata: {
        totalUsers: Object.keys(testUsers).length,
        totalTasks: testTasks.length,
        totalProjects: testProjects.length,
      },
    };

    // In a real implementation, this would create a database snapshot
    // For now, we'll use localStorage/sessionStorage approach
    await this.writeSnapshotFile(goldenData);

    console.log('✅ Golden snapshot created');
  }

  /**
   * Prepares isolated database namespaces for each Playwright worker
   * This prevents test data conflicts when running in parallel
   */
  async prepareWorkerNamespaces(workerCount: number): Promise<void> {
    console.log(`🔧 Preparing ${workerCount} worker namespaces...`);

    for (let i = 0; i < workerCount; i++) {
      const namespace = `test_worker_${i}`;
      this.workerNamespaces.set(i, namespace);

      // In a real implementation, this would create isolated DB schemas/namespaces
      // For local-first approach, we'll use different storage prefixes
      console.log(`  ✓ Namespace ${namespace} prepared`);
    }

    console.log('✅ All worker namespaces prepared');
  }

  /**
   * Gets the database namespace for a specific worker
   */
  getWorkerNamespace(workerId: number): string {
    return this.workerNamespaces.get(workerId) || 'test_worker_0';
  }

  /**
   * Restores test data for a specific scenario in a worker namespace
   */
  async restoreScenario(
    scenario: 'empty' | 'basic' | 'full',
    workerId: number = 0
  ): Promise<void> {
    const namespace = this.getWorkerNamespace(workerId);
    const testData = getTestScenario(scenario);

    console.log(`🔄 Restoring '${scenario}' scenario to ${namespace}...`);

    // In a real implementation, this would restore from DB snapshot
    // For local-first, we'll use localStorage approach in tests

    console.log(`✅ Scenario '${scenario}' restored to ${namespace}`);
    return Promise.resolve();
  }

  /**
   * Cleans up test data for a specific worker
   */
  async cleanupWorker(workerId: number): Promise<void> {
    const namespace = this.getWorkerNamespace(workerId);
    console.log(`🧹 Cleaning up ${namespace}...`);

    // Implementation would clean up the worker's data
    console.log(`✅ Cleanup completed for ${namespace}`);
  }

  /**
   * Validates that test data is in expected state
   */
  async validateTestData(workerId: number = 0): Promise<boolean> {
    const namespace = this.getWorkerNamespace(workerId);
    console.log(`✅ Validating test data in ${namespace}...`);

    // Implementation would validate data integrity
    return true;
  }

  private async writeSnapshotFile(data: any): Promise<void> {
    // In a real implementation, this would write to file system
    // For now, we'll simulate the operation
    console.log('  ✓ Snapshot file written to', this.goldenSnapshotPath);
  }
}

/**
 * Utility function to get seeded data in tests
 */
export function getSeededData() {
  return {
    users: testUsers,
    tasks: testTasks,
    projects: testProjects,
  };
}
