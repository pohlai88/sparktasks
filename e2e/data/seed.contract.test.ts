/**
 * Data Contract Tests
 *
 * Validates factory and scenario data integrity
 * Catches drift before full E2E test runs
 */

import { enterpriseTaskScenario } from './scenarios/enterpriseTaskScenario';
import { competitorBenchmarkScenario } from './scenarios/competitorBenchmarkScenario';
import { createTeam } from './factories/user';
import { createTaskDistribution } from './factories/task';

async function validateDataContracts() {
  console.log('🧪 Validating E2E data contracts...');

  try {
    // Test enterprise scenario structure
    console.log('📋 Testing enterprise task scenario...');
    const enterpriseScenario = await enterpriseTaskScenario(42);

    // Validate organization
    if (!enterpriseScenario.organization.slug.includes('enterprise')) {
      throw new Error('Enterprise organization slug invalid');
    }

    // Validate team structure
    if (enterpriseScenario.team.members.length < 10) {
      throw new Error('Enterprise team too small');
    }

    if (enterpriseScenario.admin.role !== 'admin') {
      throw new Error('Admin role incorrect');
    }

    // Validate task distribution
    if (enterpriseScenario.tasks.length < 50) {
      throw new Error('Task distribution too small');
    }

    const taskStatuses = enterpriseScenario.tasks.map(t => t.status);
    const uniqueStatuses = new Set(taskStatuses);
    if (uniqueStatuses.size < 4) {
      throw new Error('Task status distribution insufficient');
    }

    console.log('✅ Enterprise scenario contract valid');

    // Test benchmark scenario structure
    console.log('⚡ Testing benchmark scenario...');
    const benchmarkScenario = await competitorBenchmarkScenario(42);

    if (benchmarkScenario.largeTasks.length < 1000) {
      throw new Error('Benchmark dataset too small');
    }

    if (benchmarkScenario.performanceMetrics.expectedLoadTime >= 4000) {
      throw new Error('Performance targets not competitive');
    }

    console.log('✅ Benchmark scenario contract valid');

    // Test factory determinism
    console.log('🔄 Testing factory determinism...');
    const team1 = createTeam(42);
    const team2 = createTeam(42);

    if (team1.admin.email !== team2.admin.email) {
      throw new Error('User factory not deterministic');
    }

    const tasks1 = createTaskDistribution(42);
    const tasks2 = createTaskDistribution(42);

    if (tasks1[0].title !== tasks2[0].title) {
      throw new Error('Task factory not deterministic');
    }

    console.log('✅ Factory determinism validated');

    console.log('🎉 All data contracts valid!');
  } catch (error) {
    console.error('❌ Data contract validation failed:', error);
    process.exit(1);
  }
}

// Run validation
validateDataContracts().catch(error => {
  console.error('💥 Contract validation crashed:', error);
  process.exit(1);
});
