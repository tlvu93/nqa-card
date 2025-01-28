import {
  Avatar,
  Burger,
  Container,
  Drawer,
  Group,
  Menu,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { IconChevronDown, IconLogout, IconLogin, IconUser } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import cx from 'clsx';
import classes from './Header.module.scss';

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <div className={classes.header}>
        <Container className={classes.mainSection} size="md">
          <Group justify="space-between">
            <Link href="/" style={{ cursor: 'pointer' }}>
              <Image src="/logo.svg" alt="Logo" width={48} height={48} />
            </Link>
            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

            {status !== 'loading' && (
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                  >
                    <Group>
                      {session ? (
                        <Avatar src={session.user?.image} alt={session.user?.name || 'User'} />
                      ) : (
                        <Avatar>
                          <IconUser style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
                        </Avatar>
                      )}
                      <Text>{session?.user?.name || 'Guest'}</Text>
                      <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {session ? (
                    <Menu.Item
                      leftSection={
                        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      }
                      onClick={() => signOut()}
                    >
                      Logout
                    </Menu.Item>
                  ) : (
                    <Menu.Item
                      component={Link}
                      href="/login"
                      leftSection={
                        <IconLogin style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      }
                    >
                      Login
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Container>
      </div>
      <Drawer opened={opened} onClose={() => close()} title="Menu" padding="md" size="sm">
        <div className={classes.drawerContent}>
          {status !== 'loading' && (
            <Menu>
              {session ? (
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={() => signOut()}
                >
                  Logout
                </Menu.Item>
              ) : (
                <Menu.Item
                  component={Link}
                  href="/login"
                  leftSection={
                    <IconLogin style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Login
                </Menu.Item>
              )}
            </Menu>
          )}
        </div>
      </Drawer>
    </>
  );
}
