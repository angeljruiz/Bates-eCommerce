import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/components/Footer.scss'

export default () => (
    <footer className='py-2'>
        <aside className='mr-3'>
            <a href='https://www.linkedin.com/in/angel-ruiz-bates-1b68a2142/'><FontAwesomeIcon icon={['fab', 'linkedin']} size='lg' className='mr-2' /></a>
            <a href='https://github.com/angeljruiz'><FontAwesomeIcon icon={['fab', 'github']} size='lg' /></a>
        </aside>
        <br />
        <span>&copy; 2017-2020 Angel Ruiz-Bates</span>
    </footer>
)