--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: angelbates
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO angelbates;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: angelbates
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    items character varying NOT NULL,
    cid character varying NOT NULL
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    sku bigint NOT NULL,
    name character varying NOT NULL,
    type character varying(4) NOT NULL,
    num bigint NOT NULL,
    url character varying NOT NULL
);


ALTER TABLE public.image OWNER TO postgres;

--
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
-- Name: image_order_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.image_order_seq OWNED BY public.image.num;


--
-- Name: lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lock (
    sid character varying(45) NOT NULL,
    sku bigint NOT NULL,
    amount bigint NOT NULL,
    lid bigint NOT NULL
);


ALTER TABLE public.lock OWNER TO postgres;

--
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
-- Name: lock_lid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lock_lid_seq OWNED BY public.lock.lid;


--
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
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    sku bigint NOT NULL,
    name character varying(25) NOT NULL,
    price double precision,
    description character varying(300),
    quantity bigint NOT NULL,
    store bigint,
    type character varying,
    section integer NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: section; Type: TABLE; Schema: public; Owner: angelbates
--

CREATE TABLE public.section (
    id bigint NOT NULL,
    name character varying NOT NULL,
    store integer NOT NULL,
    num integer NOT NULL
);


ALTER TABLE public.section OWNER TO angelbates;

--
-- Name: section_sampleid_seq; Type: SEQUENCE; Schema: public; Owner: angelbates
--

CREATE SEQUENCE public.section_sampleid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.section_sampleid_seq OWNER TO angelbates;

--
-- Name: section_sampleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: angelbates
--

ALTER SEQUENCE public.section_sampleid_seq OWNED BY public.section.id;


--
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
-- Name: store_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.store_id_seq OWNED BY public.store.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(50) NOT NULL,
    email character varying(35) NOT NULL,
    password character varying NOT NULL,
    id character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: image num; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image ALTER COLUMN num SET DEFAULT nextval('public.image_order_seq'::regclass);


--
-- Name: lock lid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lock ALTER COLUMN lid SET DEFAULT nextval('public.lock_lid_seq'::regclass);


--
-- Name: section id; Type: DEFAULT; Schema: public; Owner: angelbates
--

ALTER TABLE ONLY public.section ALTER COLUMN id SET DEFAULT nextval('public.section_sampleid_seq'::regclass);


--
-- Name: store id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store ALTER COLUMN id SET DEFAULT nextval('public.store_id_seq'::regclass);


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (items, cid) FROM stdin;
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/ef156f74-bc83-493e-9aae-feda835e1aba"}]	PAYID-L4THOVA0YD39396WN821761T
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/75a0237f-c5a4-40ba-9f0f-07924c4c9150"}]	PAYID-L4THTZQ4EW92060PY281500X
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost/48915699-d9ad-4d62-b880-e53f868aa25c"}]	PAYID-L4THUUQ18Y19358F38364905
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost/027ed61f-9743-4421-9db9-891135953683"}]	PAYID-L4THVJI2UC81682K5327131P
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/673b74f6-a475-4acf-bd27-919edea87354"}]	PAYID-L4TH7JQ6GM13074TK287941W
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/d822f484-63d0-42e8-bbc3-6ff6aef3b62b"}]	PAYID-L4TI6EQ6U826791U0892090V
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/5eb44b50-97de-457d-b236-c9253e58f9db"}]	PAYID-L4TJBWI3PC13225W35691255
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/8b9e8c91-b377-429c-9a11-8efc97b23dc1"}]	PAYID-L4TJKMI0NH40645FH163002B
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/0733007b-5d76-4a20-838b-7b7b3538bc36"}]	PAYID-L4TJ3JQ5SP28623AL790912B
[{"sku":"3","name":"test","price":1,"description":"a test product","quantity":1,"type":"","store":"1","image":"blob:http://localhost:3000/62689326-cc22-4541-b20d-6f16f5af6ad5"}]	PAYID-L4TJ76Q0WR83348XY2744440
[{"sku":"1244","name":"Test","price":"1","description":"a testr","quantity":1,"section":""}]	PAYID-L4XKIYI62E71024150084947
[{"sku":"1244","name":"Test","price":1,"description":"a testr","quantity":1,"type":"","store":"1","images":[{"type":"jpg","name":"9f466098e7630ba2726edd65f77e6b23r.jpg","num":"67","sku":"1244","url":"https://bates-ecommerce-bucket.s3.amazonaws.com/9f466098e7630ba2726edd65f77e6b23r.jpg"}],"image":"https://bates-ecommerce-bucket.s3.amazonaws.com/9f466098e7630ba2726edd65f77e6b23r.jpg"}]	PAYID-L4X573Y4N049146M3749424N
[{"sku":"1244","name":"Test","price":1,"description":"a testr","quantity":1,"type":"","store":"1","images":[{"type":"jpg","name":"9f466098e7630ba2726edd65f77e6b23r.jpg","num":"67","sku":"1244","url":"https://bates-ecommerce-bucket.s3.amazonaws.com/9f466098e7630ba2726edd65f77e6b23r.jpg"}],"image":"https://bates-ecommerce-bucket.s3.amazonaws.com/9f466098e7630ba2726edd65f77e6b23r.jpg"}]	PAYID-L4X6BCI8R478692FL6965453
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image (sku, name, type, num, url) FROM stdin;
2	662f40a86a6030b72ca67e80f38c5a71r.jpeg	jpeg	63	https://bates-ecommerce-bucket.s3.us-east-2.amazonaws.com/662f40a86a6030b72ca67e80f38c5a71r.jpeg
1	eeb297fa8dc1fc687c38b63a1e12850er	null	64	https://bates-ecommerce-bucket.s3.us-east-2.amazonaws.com/eeb297fa8dc1fc687c38b63a1e12850er
1244	9f466098e7630ba2726edd65f77e6b23r.jpg	jpg	67	https://bates-ecommerce-bucket.s3.amazonaws.com/9f466098e7630ba2726edd65f77e6b23r.jpg
\.


--
-- Data for Name: lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lock (sid, sku, amount, lid) FROM stdin;
-1	1244	1	69
-1	1244	1	70
-1	1244	1	71
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (fn, ln, date, processing, finalized, cid, line1, city, postal_code, shipped, state) FROM stdin;
Angel	Bates	2020-08-02T08:20:57Z	t	t	PAYID-L4THOVA0YD39396WN821761T	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T08:31:49Z	t	t	PAYID-L4THTZQ4EW92060PY281500X	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T08:33:41Z	t	t	PAYID-L4THUUQ18Y19358F38364905	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T08:35:02Z	t	t	PAYID-L4THVJI2UC81682K5327131P	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T08:56:25Z	t	t	PAYID-L4TH7JQ6GM13074TK287941W	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T10:02:19Z	t	t	PAYID-L4TI6EQ6U826791U0892090V	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T10:09:49Z	t	t	PAYID-L4TJBWI3PC13225W35691255	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T11:04:25Z	t	t	PAYID-L4TJ3JQ5SP28623AL790912B	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-02T11:14:20Z	t	t	PAYID-L4TJ76Q0WR83348XY2744440	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-08T13:11:20Z	t	t	PAYID-L4XKIYI62E71024150084947	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-09T11:38:19Z	t	t	PAYID-L4X573Y4N049146M3749424N	1 Main St	San Jose	95131	false	CA
Angel	Bates	2020-08-09T11:40:09Z	t	t	PAYID-L4X6BCI8R478692FL6965453	1 Main St	San Jose	95131	false	CA
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (sku, name, price, description, quantity, store, type, section) FROM stdin;
1244	another one	1	a testr	121	1		1
2	Foxface rabbitfish	69.99	Foxfaces can grow to over a foot long and have venomous spines. As their names suggests, vegetables are some of their favorite foods!	3	1		1
1	Ocellaris Clownfish	19.99	A very bright and hardy fish. A necessity in any saltwater aquarium.	3	1		1
123	oijoijoij	123	oijoijoij	12	1		1
\.


--
-- Data for Name: section; Type: TABLE DATA; Schema: public; Owner: angelbates
--

COPY public.section (id, name, store, num) FROM stdin;
4	Featured	1	1
3	Food	1	2
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store (id, name, url, paid, email) FROM stdin;
1	super	2oijoij	0	DEFAULT
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, email, password, id) FROM stdin;
angelbates5@yahoo.com	angelbates5@yahoo.com	$2a$08$M3R4vN/5TlQ.DBc21/7hxej0nBoFIYB6i0SyFZfAdaGjYCcsY52ka	207651488
Angel Bates	danteross1996@gmail.com	0	113536219076962285527
0	0	0	-1
Angel B	angeljrbt3@gmail.com	0	101920114250194878109
Angel B	angeljrbt@gmail.com	0	110005206655458427006
\.


--
-- Name: image_order_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.image_order_seq', 67, true);


--
-- Name: lock_lid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lock_lid_seq', 71, true);


--
-- Name: section_sampleid_seq; Type: SEQUENCE SET; Schema: public; Owner: angelbates
--

SELECT pg_catalog.setval('public.section_sampleid_seq', 4, true);


--
-- Name: store_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.store_id_seq', 1, true);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (name);


--
-- Name: lock lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lock
    ADD CONSTRAINT lock_pkey PRIMARY KEY (lid);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (cid);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (sku);


--
-- Name: section section_pkey; Type: CONSTRAINT; Schema: public; Owner: angelbates
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (id);


--
-- Name: cart sqlpropk_publiccart; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT sqlpropk_publiccart PRIMARY KEY (cid);


--
-- Name: store sqlpropk_publicstore; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT sqlpropk_publicstore PRIMARY KEY (id);


--
-- Name: section fk_sec_store; Type: FK CONSTRAINT; Schema: public; Owner: angelbates
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT fk_sec_store FOREIGN KEY (store) REFERENCES public.store(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

