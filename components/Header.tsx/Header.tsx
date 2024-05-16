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
import { IconChevronDown, IconLogout } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'next-auth/react';
import cx from 'clsx';
import classes from './Header.module.scss';

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  return (
    <>
      <div className={classes.header}>
        <Container className={classes.mainSection} size="md">
          <Group justify="space-between">
            <Text>Logo</Text>
            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

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
                    <Avatar src="" alt="user name" />
                    <Text>user name</Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={() => signOut()}
                >
                  Logout
                </Menu.Item>

                <Menu.Divider />
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Container>
      </div>
      <Drawer opened={opened} onClose={() => close()} title="Menu" padding="md" size="sm">
        <div className={classes.drawerContent}>
          <Menu>
            <Menu.Item
              leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              onClick={() => signOut()}
            >
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Drawer>
    </>
  );
}
