/**
 * Enterprise Task Management Scenario
 *
 * Pre-configured business scenario with:
 * - Realistic organizational structure
 * - Diverse task portfolio
 * - Multi-user collaboration setup
 */

import { createTeam } from '../factories/user';
import { createTaskDistribution } from '../factories/task';

export interface EnterpriseTaskScenario {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  team: ReturnType<typeof createTeam>;
  tasks: ReturnType<typeof createTaskDistribution>;
  admin: ReturnType<typeof createTeam>['admin'];
}

/**
 * Create enterprise task management scenario
 * Idempotent - safe to run multiple times
 */
export async function enterpriseTaskScenario(
  seed: number = 42
): Promise<EnterpriseTaskScenario> {
  const organization = {
    id: `org_enterprise_${seed}`,
    name: 'Enterprise Corp',
    slug: 'enterprise-corp',
  };

  const team = createTeam(seed);
  const tasks = createTaskDistribution(seed);

  // Assign tasks to team members for realistic distribution
  tasks.forEach((task, index) => {
    if (index < 10) {
      task.assigneeId = team.admin.id;
    } else if (index < 30) {
      task.assigneeId = team.managers[index % 2].id;
    } else {
      task.assigneeId = team.members[index % team.members.length].id;
    }
    task.projectId = organization.id;
  });

  console.log(
    `✅ Enterprise scenario created: ${tasks.length} tasks, ${team.members.length + team.managers.length + 1} users`
  );

  return {
    organization,
    team,
    tasks,
    admin: team.admin,
  };
}
