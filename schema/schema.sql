--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4
-- Dumped by pg_dump version 11.4

-- Started on 2019-09-11 20:19:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 200 (class 1259 OID 24608)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    items character varying NOT NULL,
    cid character varying NOT NULL
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 32875)
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    id bigint NOT NULL,
    name character varying NOT NULL,
    type character varying(4) NOT NULL,
    num bigint NOT NULL
);


ALTER TABLE public.image OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 32895)
-- Name: image_order_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.image_order_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_order_seq OWNER TO postgres;

--
-- TOC entry 2879 (class 0 OID 0)
-- Dependencies: 206
-- Name: image_order_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.image_order_seq OWNED BY public.image.num;


--
-- TOC entry 203 (class 1259 OID 32832)
-- Name: lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lock (
    sid character varying(45) NOT NULL,
    id bigint NOT NULL,
    amount bigint NOT NULL,
    lid bigint NOT NULL
);


ALTER TABLE public.lock OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 32837)
-- Name: lock_lid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lock_lid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lock_lid_seq OWNER TO postgres;

--
-- TOC entry 2880 (class 0 OID 0)
-- Dependencies: 204
-- Name: lock_lid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lock_lid_seq OWNED BY public.lock.lid;


--
-- TOC entry 197 (class 1259 OID 24582)
-- Name: marinefish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marinefish (
    id bigint NOT NULL,
    rs boolean NOT NULL,
    ming smallint NOT NULL,
    ag character(3)
);


ALTER TABLE public.marinefish OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 24603)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    fn character varying(30) NOT NULL,
    ln character varying(30) NOT NULL,
    date character varying(20) NOT NULL,
    processing boolean NOT NULL,
    finalized boolean NOT NULL,
    cid character varying(50) NOT NULL,
    line1 character varying(55),
    city character varying(35),
    postal_code bigint,
    shipped character varying(25),
    state character varying(2)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 24577)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id bigint NOT NULL,
    name character varying(25) NOT NULL,
    price double precision,
    description character varying(50),
    quantity bigint NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 24623)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 32934)
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id bigint NOT NULL,
    name character varying NOT NULL,
    url character varying NOT NULL,
    paid bigint,
    email character varying NOT NULL
);


ALTER TABLE public.store OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 32932)
-- Name: store_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.store_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.store_id_seq OWNER TO postgres;

--
-- TOC entry 2881 (class 0 OID 0)
-- Dependencies: 207
-- Name: store_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_id_seq OWNED BY public.store.id;


--
-- TOC entry 198 (class 1259 OID 24595)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(15) NOT NULL,
    email character varying(35) NOT NULL,
    password character varying NOT NULL,
    id bigint NOT NULL,
    pp bit varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 24631)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2882 (class 0 OID 0)
-- Dependencies: 202
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2731 (class 2604 OID 32897)
-- Name: image num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image ALTER COLUMN num SET DEFAULT nextval('public.image_order_seq'::regclass);


--
-- TOC entry 2730 (class 2604 OID 32839)
-- Name: lock lid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lock ALTER COLUMN lid SET DEFAULT nextval('public.lock_lid_seq'::regclass);


--
-- TOC entry 2732 (class 2604 OID 32937)
-- Name: store id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store ALTER COLUMN id SET DEFAULT nextval('public.store_id_seq'::regclass);


--
-- TOC entry 2729 (class 2604 OID 24633)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2742 (class 2606 OID 24617)
-- Name: cart c_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT c_pk PRIMARY KEY (cid);


--
-- TOC entry 2748 (class 2606 OID 32885)
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (name);


--
-- TOC entry 2746 (class 2606 OID 32845)
-- Name: lock lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lock
    ADD CONSTRAINT lock_pkey PRIMARY KEY (lid);


--
-- TOC entry 2736 (class 2606 OID 24589)
-- Name: marinefish marinefish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marinefish
    ADD CONSTRAINT marinefish_pkey PRIMARY KEY (id);


--
-- TOC entry 2740 (class 2606 OID 32800)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (cid);


--
-- TOC entry 2734 (class 2606 OID 24581)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 2744 (class 2606 OID 24630)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 2750 (class 2606 OID 32942)
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id, url);


--
-- TOC entry 2738 (class 2606 OID 24641)
-- Name: users u_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT u_pk PRIMARY KEY (id);


--
-- TOC entry 2752 (class 2606 OID 32801)
-- Name: cart c_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT c_fk FOREIGN KEY (cid) REFERENCES public.orders(cid);


--
-- TOC entry 2751 (class 2606 OID 24590)
-- Name: marinefish mf_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marinefish
    ADD CONSTRAINT mf_fk FOREIGN KEY (id) REFERENCES public.product(id);


-- Completed on 2019-09-11 20:19:58

--
-- PostgreSQL database dump complete
--

