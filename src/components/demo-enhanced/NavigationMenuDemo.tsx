/**
 * Enhanced Navigation Menu Demo - MAPS v2.2 Dark-First Philosophy
 *
 * Comprehensive showcase demonstrating Enhanced Navigation Menu capabilities
 * with Apple HIG compliance, liquid glass materials, and AAA accessibility
 */

import {
  ChevronRight,
  Code,
  Database,
  Globe,
  Laptop,
  Users,
  Zap,
} from 'lucide-react';
import React from 'react';

import {
  EnhancedNavigationMenu,
  EnhancedNavigationMenuList,
  EnhancedNavigationMenuItem,
  EnhancedNavigationMenuTrigger,
  EnhancedNavigationMenuContent,
  EnhancedNavigationMenuLink,
  EnhancedNavigationMenuIndicator,
} from '../ui-enhanced/NavigationMenu';

// ===== NAVIGATION MENU DEMO COMPONENT =====

const NavigationMenuDemo: React.FC = () => {
  return (
    <div className='space-y-8'>
      {/* Basic Navigation Menu */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Basic Navigation Menu
        </h3>
        <p className='text-sm text-muted-foreground'>
          Standard horizontal navigation with dropdown content
        </p>

        <div className='flex justify-center'>
          <EnhancedNavigationMenu orientation='horizontal' className='w-max'>
            <EnhancedNavigationMenuList>
              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuTrigger>
                  Products
                </EnhancedNavigationMenuTrigger>
                <EnhancedNavigationMenuContent>
                  <div className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                    <div className='row-span-3'>
                      <EnhancedNavigationMenuLink
                        href='/products/overview'
                        variant='accent'
                      >
                        <div className='flex items-center space-x-3'>
                          <Laptop className='h-6 w-6' />
                          <div>
                            <div className='mb-2 mt-4 text-lg font-medium'>
                              Product Suite
                            </div>
                            <p className='text-sm leading-tight text-muted-foreground'>
                              Comprehensive platform for modern development
                              teams.
                            </p>
                          </div>
                        </div>
                      </EnhancedNavigationMenuLink>
                    </div>
                    <EnhancedNavigationMenuLink href='/analytics'>
                      <div className='flex items-center space-x-2'>
                        <Database className='h-4 w-4' />
                        <span>Analytics Platform</span>
                      </div>
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/automation'>
                      <div className='flex items-center space-x-2'>
                        <Zap className='h-4 w-4' />
                        <span>Automation Tools</span>
                      </div>
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/integrations'>
                      <div className='flex items-center space-x-2'>
                        <Globe className='h-4 w-4' />
                        <span>Integrations</span>
                      </div>
                    </EnhancedNavigationMenuLink>
                  </div>
                </EnhancedNavigationMenuContent>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuTrigger>
                  Solutions
                </EnhancedNavigationMenuTrigger>
                <EnhancedNavigationMenuContent>
                  <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[600px] lg:grid-cols-2'>
                    <li className='row-span-3'>
                      <EnhancedNavigationMenuLink
                        href='/solutions/enterprise'
                        variant='accent'
                        active={true}
                      >
                        <div className='flex items-center space-x-3'>
                          <Users className='h-6 w-6' />
                          <div>
                            <div className='mb-2 mt-4 text-lg font-medium'>
                              Enterprise Solutions
                            </div>
                            <p className='text-sm leading-tight text-muted-foreground'>
                              Scalable solutions for enterprise requirements.
                            </p>
                          </div>
                        </div>
                      </EnhancedNavigationMenuLink>
                    </li>
                    <li>
                      <EnhancedNavigationMenuLink href='/solutions/startups'>
                        <div className='flex items-center justify-between'>
                          <span>For Startups</span>
                          <ChevronRight className='h-4 w-4' />
                        </div>
                      </EnhancedNavigationMenuLink>
                    </li>
                    <li>
                      <EnhancedNavigationMenuLink href='/solutions/agencies'>
                        <div className='flex items-center justify-between'>
                          <span>For Agencies</span>
                          <ChevronRight className='h-4 w-4' />
                        </div>
                      </EnhancedNavigationMenuLink>
                    </li>
                    <li>
                      <EnhancedNavigationMenuLink href='/solutions/developers'>
                        <div className='flex items-center justify-between'>
                          <span>For Developers</span>
                          <ChevronRight className='h-4 w-4' />
                        </div>
                      </EnhancedNavigationMenuLink>
                    </li>
                  </ul>
                </EnhancedNavigationMenuContent>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/pricing'>
                  Pricing
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/contact' variant='subtle'>
                  Contact
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>
            </EnhancedNavigationMenuList>

            <EnhancedNavigationMenuIndicator />
          </EnhancedNavigationMenu>
        </div>
      </div>

      {/* Glass Effect Navigation */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Liquid Glass Navigation
        </h3>
        <p className='text-sm text-muted-foreground'>
          Navigation with liquid glass vibrancy effects for premium feel
        </p>

        <div className='flex justify-center'>
          <EnhancedNavigationMenu
            orientation='horizontal'
            vibrancy='glass'
            className='w-max'
          >
            <EnhancedNavigationMenuList>
              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuTrigger variant='accent'>
                  Platform
                </EnhancedNavigationMenuTrigger>
                <EnhancedNavigationMenuContent vibrancy='enhanced'>
                  <div className='grid gap-3 p-6 md:w-[500px] lg:grid-cols-2'>
                    <EnhancedNavigationMenuLink
                      href='/platform/overview'
                      variant='accent'
                    >
                      <div className='flex items-center space-x-3'>
                        <Code className='h-5 w-5' />
                        <div>
                          <div className='font-medium'>Platform Overview</div>
                          <p className='text-xs text-muted-foreground'>
                            Complete development platform
                          </p>
                        </div>
                      </div>
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/platform/api'>
                      <div className='flex items-center space-x-3'>
                        <Database className='h-5 w-5' />
                        <div>
                          <div className='font-medium'>API & SDK</div>
                          <p className='text-xs text-muted-foreground'>
                            Developer tools and resources
                          </p>
                        </div>
                      </div>
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/platform/hosting'>
                      <div className='flex items-center space-x-3'>
                        <Globe className='h-5 w-5' />
                        <div>
                          <div className='font-medium'>Cloud Hosting</div>
                          <p className='text-xs text-muted-foreground'>
                            Global edge network
                          </p>
                        </div>
                      </div>
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/platform/analytics'>
                      <div className='flex items-center space-x-3'>
                        <Zap className='h-5 w-5' />
                        <div>
                          <div className='font-medium'>Real-time Analytics</div>
                          <p className='text-xs text-muted-foreground'>
                            Performance insights
                          </p>
                        </div>
                      </div>
                    </EnhancedNavigationMenuLink>
                  </div>
                </EnhancedNavigationMenuContent>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/docs' variant='default'>
                  Documentation
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/community' variant='subtle'>
                  Community
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>
            </EnhancedNavigationMenuList>

            <EnhancedNavigationMenuIndicator />
          </EnhancedNavigationMenu>
        </div>
      </div>

      {/* Vertical Navigation */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Vertical Navigation
        </h3>
        <p className='text-sm text-muted-foreground'>
          Sidebar-style vertical navigation menu
        </p>

        <div className='flex justify-center'>
          <EnhancedNavigationMenu orientation='vertical' className='w-64'>
            <EnhancedNavigationMenuList orientation='vertical'>
              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuTrigger size='lg' showIndicator={false}>
                  <div className='flex items-center space-x-3'>
                    <Laptop className='h-5 w-5' />
                    <span>Dashboard</span>
                  </div>
                </EnhancedNavigationMenuTrigger>
                <EnhancedNavigationMenuContent>
                  <div className='space-y-2 p-4'>
                    <EnhancedNavigationMenuLink href='/dashboard/overview'>
                      Overview
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink
                      href='/dashboard/projects'
                      active={true}
                    >
                      Projects
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/dashboard/team'>
                      Team
                    </EnhancedNavigationMenuLink>
                  </div>
                </EnhancedNavigationMenuContent>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/settings' variant='subtle'>
                  <div className='flex items-center space-x-3'>
                    <Users className='h-5 w-5' />
                    <span>Settings</span>
                  </div>
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/help' variant='subtle'>
                  <div className='flex items-center space-x-3'>
                    <Globe className='h-5 w-5' />
                    <span>Help & Support</span>
                  </div>
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>
            </EnhancedNavigationMenuList>

            <EnhancedNavigationMenuIndicator />
          </EnhancedNavigationMenu>
        </div>
      </div>

      {/* AAA Compliance Mode */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          AAA Compliance Mode
        </h3>
        <p className='text-sm text-muted-foreground'>
          High contrast mode for enhanced accessibility compliance
        </p>

        <div className='flex justify-center'>
          <EnhancedNavigationMenu
            orientation='horizontal'
            enforceAAA={true}
            className='w-max'
          >
            <EnhancedNavigationMenuList>
              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuTrigger>
                  Accessibility
                </EnhancedNavigationMenuTrigger>
                <EnhancedNavigationMenuContent>
                  <div className='w-80 space-y-3 p-4'>
                    <EnhancedNavigationMenuLink
                      href='/a11y/overview'
                      variant='accent'
                    >
                      <div>
                        <div className='font-medium'>
                          Accessibility Overview
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          Our commitment to inclusive design
                        </p>
                      </div>
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/a11y/guidelines'>
                      Design Guidelines
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink href='/a11y/testing'>
                      Testing Resources
                    </EnhancedNavigationMenuLink>
                    <EnhancedNavigationMenuLink
                      href='/a11y/compliance'
                      active={true}
                    >
                      WCAG Compliance
                    </EnhancedNavigationMenuLink>
                  </div>
                </EnhancedNavigationMenuContent>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/features'>
                  Features
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>

              <EnhancedNavigationMenuItem>
                <EnhancedNavigationMenuLink href='/support' variant='subtle'>
                  Support
                </EnhancedNavigationMenuLink>
              </EnhancedNavigationMenuItem>
            </EnhancedNavigationMenuList>

            <EnhancedNavigationMenuIndicator />
          </EnhancedNavigationMenu>
        </div>
      </div>

      {/* Usage Examples */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Implementation Examples
        </h3>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-lg border border-border bg-card p-4'>
            <h4 className='mb-2 font-medium text-foreground'>Basic Usage</h4>
            <pre className='overflow-x-auto rounded bg-muted p-3 text-xs text-muted-foreground'>
              {`<EnhancedNavigationMenu>
  <EnhancedNavigationMenuList>
    <EnhancedNavigationMenuItem>
      <EnhancedNavigationMenuTrigger>
        Products
      </EnhancedNavigationMenuTrigger>
      <EnhancedNavigationMenuContent>
        <EnhancedNavigationMenuLink href="/link">
          Navigation Link
        </EnhancedNavigationMenuLink>
      </EnhancedNavigationMenuContent>
    </EnhancedNavigationMenuItem>
  </EnhancedNavigationMenuList>
</EnhancedNavigationMenu>`}
            </pre>
          </div>

          <div className='rounded-lg border border-border bg-card p-4'>
            <h4 className='mb-2 font-medium text-foreground'>With Variants</h4>
            <pre className='overflow-x-auto rounded bg-muted p-3 text-xs text-muted-foreground'>
              {`<EnhancedNavigationMenu
  vibrancy="glass"
  enforceAAA={true}
>
  <EnhancedNavigationMenuList>
    <EnhancedNavigationMenuItem>
      <EnhancedNavigationMenuTrigger
        variant="accent"
        size="lg"
      >
        Platform
      </EnhancedNavigationMenuTrigger>
    </EnhancedNavigationMenuItem>
  </EnhancedNavigationMenuList>
</EnhancedNavigationMenu>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenuDemo;
