import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href='https://github.com/boxyhq/jackson-examples/tree/main/apps/next-auth'>GitHub</a>
        </li>
        <li className={styles.navItem}>
          <Link href='/policy'>Policy</Link>
        </li>
        <li className={styles.navItem}>
          <a href='https://github.com/boxyhq/jackson'>Integrate SAML with a few lines of code</a>
        </li>
      </ul>
    </footer>
  );
}
